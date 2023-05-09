import { inject, injectable } from 'tsyringe'

import { IPersonalitiesRepository } from '@modules/persons/infra/repositories/contracts/IPersonalitiesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPersonality } from '@modules/persons/infra/repositories/entities/IPersonality'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

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
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const personalityToUpdate = await this.personalitiesRepository.findById(
      personalityId,
    )

    if (!personalityToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Característica de personalidade',
      })
    }

    const updatedPersonality = await this.personalitiesRepository.update({
      personalityId,
      data: {
        title,
        description,
      },
    })

    if (!updatedPersonality) throw makeErrorPersonNotUpdate()

    return { personality: updatedPersonality }
  }
}
