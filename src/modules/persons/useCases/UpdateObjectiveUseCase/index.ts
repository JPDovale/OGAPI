import { inject, injectable } from 'tsyringe'

import { IObjectivesRepository } from '@modules/persons/infra/repositories/contracts/IObjectivesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IObjective } from '@modules/persons/infra/repositories/entities/IObjective'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  objectiveId: string
  title?: string
  description?: string
  itBeRealized?: boolean
}

interface IResponse {
  objective: IObjective
}

@injectable()
export class UpdateObjectiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ObjectivesRepository)
    private readonly objectivesRepository: IObjectivesRepository,
  ) {}

  async execute({
    objectiveId,
    personId,
    userId,
    description,
    title,
    itBeRealized,
  }: IRequest): Promise<IResolve<IResponse>> {
    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const objectiveToUpdate = await this.objectivesRepository.findById(
      objectiveId,
    )

    if (!objectiveToUpdate) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Objetivo',
        }),
      }
    }

    const updatedObjetive = await this.objectivesRepository.update({
      objectiveId,
      data: {
        title,
        description,
        it_be_realized: itBeRealized,
      },
    })

    if (!updatedObjetive) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        objective: updatedObjetive,
      },
    }
  }
}
