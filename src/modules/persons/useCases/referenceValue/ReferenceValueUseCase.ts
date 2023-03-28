import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type IReferenceValueDTO } from '@modules/persons/dtos/IReferenceValueDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type IValue } from '@modules/persons/infra/mongoose/entities/Value'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class ReferenceValueUseCase {
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
    value: IReferenceValueDTO,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const { archive, box } = await this.boxesControllers.linkObject({
      boxName: 'persons/values',
      objectToLinkId: person.id,
      projectId,
      archiveId: refId,
    })

    const valuesToIndexOnPerson: IValue = {
      id: archive.archive.id ?? '',
      title: archive.archive.title ?? '',
      description: archive.archive.description ?? '',
      exceptions: value.exceptions,
    }

    const updatedValue = [...person.values, valuesToIndexOnPerson]

    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      updatedValue,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate

    return { person: updatedPerson, box }
  }
}
