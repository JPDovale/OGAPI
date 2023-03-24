import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IBoxesControllers } from '@shared/container/services/boxesControllers/IBoxesControllers'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

interface IResponse {
  person: IPersonMongo
  box: IBox
}

@injectable()
export class DeleteValueUseCase {
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
    valueId: string,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredValues = person.values.filter((value) => value.id !== valueId)

    const box = await this.boxesControllers.unlinkObject({
      archiveId: valueId,
      boxName: 'persons/values',
      objectToUnlinkId: personId,
      projectId: project.id,
    })

    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      filteredValues,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, box }
  }
}
