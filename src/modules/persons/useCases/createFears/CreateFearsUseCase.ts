import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type ICreateGenericObjectDTO } from '@modules/persons/dtos/ICreateGenericObjectDTO'
import { Fear } from '@modules/persons/infra/mongoose/entities/Fear'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

interface IRequest {
  userId: string
  projectId: string
  personId: string
  fear: ICreateGenericObjectDTO
}

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class CreateFearUseCase {
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
    personId,
    fear,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: projectId ?? person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const fearExistesToThiPerson = person.fears.find(
      (f) => f.title === fear.title,
    )

    if (fearExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um medo',
      })

    const newFear = new Fear({
      description: fear.description,
      title: fear.title,
    })

    const box = await this.boxesControllers.controllerInternalBoxes({
      archive: newFear,
      error: {
        title: 'Medo já existe nos arquivos internos do projeto.',
        message:
          'Você já criou um medo com esse nome para outro personagem... Caso o medo seja o mesma, tente atribui-lo ao personagem, ou então escolha outro nome.',
      },
      name: 'persons/fears',
      projectId,
      projectName: project.name,
      userId,
      linkId: person.id,
    })

    const updatedFears = [newFear, ...person.fears]
    const updatedPerson = await this.personsRepository.updateFears(
      personId,
      updatedFears,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
