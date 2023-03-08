import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IDream } from '@modules/persons/infra/mongoose/entities/Dream'
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
export class ReferenceDreamUseCase {
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
      boxName: 'persons/dreams',
      objectToLinkId: person.id,
      projectId,
      archiveId: refId,
    })

    const dreamToIndexOnPerson: IDream = {
      id: archive.archive.id || '',
      title: archive.archive.title || '',
      description: archive.archive.description || '',
    }

    const updatedObjetives = [...person.dreams, dreamToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedObjetives,
    )

    return { person: updatedPerson, box }
  }
}
