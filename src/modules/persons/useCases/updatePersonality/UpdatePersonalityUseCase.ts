import { inject, injectable } from 'tsyringe'

import { IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    const filteredPersonality = person.personality.filter(
      (personality) => personality.id !== personalityId,
    )
    const personalityToUpdate = person.personality.find(
      (personality) => personality.id === personalityId,
    )

    const updatedPersonality: IPersonality = {
      ...personalityToUpdate,
      ...personality,
    }

    const updatePersonality = [...filteredPersonality, updatedPersonality]

    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatePersonality,
    )

    return updatedPerson
  }
}
