import { inject, injectable } from 'tsyringe'

import { IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IReferenceTraumaDTO } from '@modules/persons/dtos/IReferenceTraumaDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class ReferenceTraumaUseCase {
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
    trauma: IReferenceTraumaDTO,
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
      boxName: 'persons/traumas',
      objectToLinkId: person.id,
      projectId,
      archiveId: refId,
    })

    const traumaToIndexOnPerson: ITrauma = {
      id: archive.archive.id || '',
      title: archive.archive.title || '',
      description: archive.archive.description || '',
      consequences: trauma.consequences,
    }

    const updatedTrauma = [...person.traumas, traumaToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updatedTrauma,
    )

    return { person: updatedPerson, box }
  }
}
