import { inject, injectable } from 'tsyringe'

import { IDreamsRepository } from '@modules/persons/infra/repositories/contracts/IDreamsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IDream } from '@modules/persons/infra/repositories/entities/IDream'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  dreamId: string
  title?: string
  description?: string
}

interface IResponse {
  dream: IDream
}

@injectable()
export class UpdateDreamUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.DreamsRepository)
    private readonly dreamsRepository: IDreamsRepository,
  ) {}

  async execute({
    dreamId,
    personId,
    userId,
    description,
    title,
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

    const dreamToUpdate = await this.dreamsRepository.findById(dreamId)

    if (!dreamToUpdate) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Sonho',
        }),
      }
    }

    const updatedDream = await this.dreamsRepository.update({
      dreamId,
      data: {
        description,
        title,
      },
    })

    if (!updatedDream) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        dream: updatedDream,
      },
    }
  }
}
