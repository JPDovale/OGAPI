import { inject, injectable } from 'tsyringe'

import { type IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdatePersonalityUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    personalityId: string,
    personality: IUpdatePersonalityDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredPersonality = person.personality.filter(
      (personality) => personality.id !== personalityId,
    )
    const personalityToUpdate = person.personality.find(
      (personality) => personality.id === personalityId,
    )

    if (!personalityToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Característica de personalidade',
      })
    }

    const updatedPersonality: IPersonality = {
      consequences:
        personality.consequences ?? personalityToUpdate.consequences,
      description: personality.description ?? personalityToUpdate.description,
      title: personality.title ?? personalityToUpdate.title,
      id: personalityToUpdate.id,
    }

    const updatePersonality = [...filteredPersonality, updatedPersonality]

    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatePersonality,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
