import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
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
export class DeletePowerUseCase {
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
    powerId: string,
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    const { project } = await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredPowers = person.powers.filter((power) => power.id !== powerId)

    const box = await this.boxesControllers.unlinkObject({
      archiveId: powerId,
      boxName: 'persons/powers',
      objectToUnlinkId: personId,
      projectId: project.id,
    })

    const updatePerson = await this.personsRepository.updatePowers(
      personId,
      filteredPowers,
    )

    if (!updatePerson) throw makeErrorPersonNotUpdate()

    return { person: updatePerson, box }
  }
}
