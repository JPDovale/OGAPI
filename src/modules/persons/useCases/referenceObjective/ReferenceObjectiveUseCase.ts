import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IReferenceObjectiveDTO } from '@modules/persons/dtos/IReferenceObjectiveDTO'
import { IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  person: IPersonMongo
  box: IBox
}
@injectable()
export class ReferenceObjectiveUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    personId: string,
    refId: string,
    objective: IReferenceObjectiveDTO,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const { archive, box } = await this.boxesControllers.linkObject({
      boxName: 'persons/objectives',
      objectToLinkId: person.id,
      projectId,
      archiveId: refId,
    })

    const objetiveToIndexOnPerson: IObjective = {
      id: archive.archive.id || '',
      title: archive.archive.title || '',
      description: archive.archive.description || '',
      avoiders: objective.avoiders,
      supporting: objective.supporting,
      objectified: objective.objectified,
    }

    const updatedObjetives = [...person.objectives, objetiveToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    return { person: updatedPerson, box }
  }
}
