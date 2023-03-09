import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IReferencePersonalityDTO } from '@modules/persons/dtos/IReferencePersonalityDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class ReferencePersonalityUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('BoxesControllers')
    private readonly boxesControllers: IBoxesControllers,
  ) {}

  async execute(
    userId: string,
    projectId: string,
    personId: string,
    refId: string,
    personality: IReferencePersonalityDTO,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const { archive, box } = await this.boxesControllers.linkObject({
      boxName: 'persons/personality',
      objectToLinkId: person.id,
      projectId,
      archiveId: refId,
    })

    const personalityToIndexOnPerson: IPersonality = {
      id: archive.archive.id || '',
      title: archive.archive.title || '',
      description: archive.archive.description || '',
      consequences: personality.consequences,
    }

    const updatedPersonality = [
      ...person.personality,
      personalityToIndexOnPerson,
    ]

    const updatedPerson = await this.personsRepository.updatePersonality(
      personId,
      updatedPersonality,
    )

    return { person: updatedPerson, box }
  }
}
