import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type IReferencePersonalityDTO } from '@modules/persons/dtos/IReferencePersonalityDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type IPersonality } from '@modules/persons/infra/mongoose/entities/Personality'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

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

    if (!person) throw makeErrorPersonNotFound()

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
      id: archive.archive.id ?? '',
      title: archive.archive.title ?? '',
      description: archive.archive.description ?? '',
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

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
