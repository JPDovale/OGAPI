import { inject, injectable } from 'tsyringe'

import { IPersonalitiesRepository } from '@modules/persons/infra/repositories/contracts/IPersonalitiesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPersonality } from '@modules/persons/infra/repositories/entities/IPersonality'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  title: string
  description: string
  consequences?: Array<{
    title: string
    description: string
  }>
}

interface IResponse {
  personality: IPersonality
}

@injectable()
export class CreatePersonalityUseCase {
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
    title,
    description,
    consequences,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }
    const response = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    const personalityExistesToThiPerson = person.personalities?.find(
      (personality) =>
        personality.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (personalityExistesToThiPerson) {
      return {
        ok: false,
        error: makeErrorAlreadyExistesWithName({
          whatExistes: 'uma característica de personalidade',
        }),
      }
    }

    const personality = await this.personalitiesRepository.create(
      {
        title,
        description,
        consequences: {
          createMany: {
            data: consequences ?? [],
          },
        },
        persons: {
          connect: {
            id: person.id,
          },
        },
      },
      personId,
    )

    if (!personality) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        personality,
      },
    }
  }
}
