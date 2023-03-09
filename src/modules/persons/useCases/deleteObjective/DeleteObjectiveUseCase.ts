import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
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
export class DeleteObjectiveUseCase {
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
    personId: string,
    objectiveId: string,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const filteredObjectives = person.objectives.filter(
      (objective) => objective.id !== objectiveId,
    )

    const box = await this.boxesControllers.unlinkObject({
      archiveId: objectiveId,
      boxName: 'persons/objectives',
      objectToUnlinkId: personId,
      projectId: project.id,
    })

    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      filteredObjectives,
    )
    return { person: updatedPerson, box }
  }
}
