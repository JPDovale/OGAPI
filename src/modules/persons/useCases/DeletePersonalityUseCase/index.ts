import { inject, injectable } from 'tsyringe'

import { IPersonalitiesRepository } from '@modules/persons/infra/repositories/contracts/IPersonalitiesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  personalityId: string
}

@injectable()
export class DeletePersonalityUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.PersonalitiesRepository)
    private readonly personalitiesRepository: IPersonalitiesRepository,
  ) {}

  async execute({ personId, personalityId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const personalityToRemovePerson =
      await this.personalitiesRepository.findById(personalityId)

    if (!personalityToRemovePerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Personalidade',
      })

    const numbersOfPersonInPersonality =
      personalityToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInPersonality <= 0) {
      await this.personalitiesRepository.delete(personalityId)
    } else {
      await this.personalitiesRepository.removeOnePersonById({
        objectId: personalityId,
        personId,
      })
    }
  }
}
