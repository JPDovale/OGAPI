import { inject, injectable } from 'tsyringe'

import { IFearsRepository } from '@modules/persons/infra/repositories/contracts/IFearsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IFear } from '@modules/persons/infra/repositories/entities/IFear'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  fearId: string
  title?: string
  description?: string
}

interface IResponse {
  fear: IFear
}

@injectable()
export class UpdateFearUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.FearsRepository)
    private readonly fearsRepository: IFearsRepository,
  ) {}

  async execute({
    fearId,
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

    const fearToUpdate = await this.fearsRepository.findById(fearId)

    if (!fearToUpdate) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Medo',
        }),
      }
    }

    const updatedFear = await this.fearsRepository.update({
      fearId,
      data: {
        title,
        description,
      },
    })

    if (!updatedFear) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        fear: updatedFear,
      },
    }
  }
}
