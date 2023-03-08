import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class DeletePersonalityUseCase {
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
    personId: string,
    personalityId: string,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const filteredPersonality = person.personality.filter(
      (p) => p.id !== personalityId,
    )

    const box = await this.boxesControllers.unlinkObject({
      archiveId: personalityId,
      boxName: 'persons/personality',
      objectToUnlinkId: personId,
      projectId: project.id,
    })

    const updatedPeron = await this.personsRepository.updatePersonality(
      personId,
      filteredPersonality,
    )

    return { person: updatedPeron, box }
  }
}
