import { inject, injectable } from 'tsyringe'

import { IPersonalitiesRepository } from '@modules/persons/infra/repositories/contracts/IPersonalitiesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPersonality } from '@modules/persons/infra/repositories/entities/IPersonality'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  personalityId: string
  title?: string
  description?: string
}

interface IResponse {
  personality: IPersonality
}

@injectable()
export class UpdatePersonalityUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.PersonalitiesRepository)
    private readonly personalitiesRepository: IPersonalitiesRepository,
  ) {}

  async execute({
    personId,
    personalityId,
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

    const personalityToUpdate = await this.personalitiesRepository.findById(
      personalityId,
    )

    if (!personalityToUpdate) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Característica de personalidade',
        }),
      }
    }

    const updatedPersonality = await this.personalitiesRepository.update({
      personalityId,
      data: {
        title,
        description,
      },
    })

    if (!updatedPersonality) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        personality: updatedPersonality,
      },
    }
  }
}
