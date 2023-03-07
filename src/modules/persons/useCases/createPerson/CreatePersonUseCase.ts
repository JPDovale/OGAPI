import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'

interface IRequest {
  userId: string
  projectId: string
  newPerson: ICreatePersonDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreatePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute({
    userId,
    projectId,
    newPerson,
  }: IRequest): Promise<IResponse> {
    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const person = await this.personsRepository.create(
      userId,
      projectId,
      newPerson,
    )

    const box = await this.boxesControllers.controllerInternalBoxes({
      name: 'persons',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
      withoutArchive: true,
    })

    return { person, box }
  }
}
