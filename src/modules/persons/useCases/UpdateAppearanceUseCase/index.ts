import { inject, injectable } from 'tsyringe'

import { IAppearancesRepository } from '@modules/persons/infra/repositories/contracts/IAppearancesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IAppearance } from '@modules/persons/infra/repositories/entities/IAppearance'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  appearanceId: string
  title?: string
  description?: string
}

interface IResponse {
  appearance: IAppearance
}

@injectable()
export class UpdateAppearanceUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.AppearancesRepository)
    private readonly appearancesRepository: IAppearancesRepository,
  ) {}

  async execute({
    appearanceId,
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

    const appearanceToEdit = await this.appearancesRepository.findById(
      appearanceId,
    )

    if (!appearanceToEdit) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Aparência',
        }),
      }
    }

    const appearanceUpdated = await this.appearancesRepository.update({
      appearanceId,
      data: {
        title,
        description,
      },
    })

    if (!appearanceUpdated) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        appearance: appearanceUpdated,
      },
    }
  }
}
