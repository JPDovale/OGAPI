import { inject, injectable } from 'tsyringe'

import { IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'
import { IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateObjectiveUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    objectiveId: string,
    objective: IUpdateObjectiveDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    const filteredObjectives = person.objectives.filter(
      (objective) => objective.id !== objectiveId,
    )
    const objectiveToUpdate = person.objectives.find(
      (objective) => objective.id === objectiveId,
    )

    const updatedObjetive: IObjective = {
      ...objectiveToUpdate,
      ...objective,
    }

    const updatedObjetives = [...filteredObjectives, updatedObjetive]

    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    return updatedPerson
  }
}
