import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type IReferenceTraumaDTO } from '@modules/persons/dtos/IReferenceTraumaDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
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

    if (!person) throw makeErrorPersonNotFound()

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
      id: archive.archive.id ?? '',
      title: archive.archive.title ?? '',
      description: archive.archive.description ?? '',
      consequences: trauma.consequences,
    }

    const updatedTrauma = [...person.traumas, traumaToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updatedTrauma,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate

    return { person: updatedPerson, box }
  }
}
