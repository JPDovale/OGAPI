import { inject, injectable } from 'tsyringe'

import { type IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'
import { type IObjective } from '@modules/persons/infra/mongoose/entities/Objective'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

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

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredObjectives = person.objectives.filter(
      (objective) => objective.id !== objectiveId,
    )
    const objectiveToUpdate = person.objectives.find(
      (objective) => objective.id === objectiveId,
    )

    if (!objectiveToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Objetivo',
      })
    }

    const updatedObjetive: IObjective = {
      avoiders: objective.avoiders ?? objectiveToUpdate.avoiders,
      supporting: objective.supporting ?? objectiveToUpdate.supporting,
      title: objective.title ?? objectiveToUpdate.title,
      description: objective.description ?? objectiveToUpdate.description,
      objectified: objective.objectified ?? objectiveToUpdate.objectified,
      id: objectiveToUpdate.id,
    }

    const updatedObjetives = [...filteredObjectives, updatedObjetive]

    const updatedPerson = await this.personsRepository.updateObjectives(
      personId,
      updatedObjetives,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
