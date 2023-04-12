import { inject, injectable } from 'tsyringe'

import { IObjectivesRepository } from '@modules/persons/infra/repositories/contracts/IObjectivesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IObjective } from '@modules/persons/infra/repositories/entities/IObjective'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

interface IRequest {
  userId: string
  personId: string
  avoiders?: Array<{ id: string }>
  supporters?: Array<{ id: string }>
  itBeRealized: boolean
  title: string
  description: string
}

interface IResponse {
  objective: IObjective
}

@injectable()
export class CreateObjectiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ObjectivesRepository)
    private readonly objectivesRepository: IObjectivesRepository,
  ) {}

  async execute({
    personId,
    userId,
    avoiders,
    description,
    itBeRealized,
    supporters,
    title,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const objectiveExistesToThiPerson = person.objectives?.find(
      (objective) =>
        objective.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (objectiveExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um objetivo',
      })

    const objective = await this.objectivesRepository.create({
      title,
      description,
      it_be_realized: itBeRealized,
      persons: {
        connect: {
          id: person.id,
        },
      },
      avoiders: {
        create: {
          persons: {
            connect: avoiders,
          },
        },
      },
      supporters: {
        create: {
          persons: {
            connect: supporters,
          },
        },
      },
    })

    if (!objective) throw makeErrorPersonNotUpdate()

    return { objective }
  }
}
