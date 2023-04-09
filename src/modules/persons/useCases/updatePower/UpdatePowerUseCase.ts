import { inject, injectable } from 'tsyringe'

import { type IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type IPower } from '@modules/persons/infra/mongoose/entities/Power'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdatePowerUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    powerId: string,
    power: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredPowers = person.powers.filter((power) => power.id !== powerId)
    const powerToUpdate = person.powers.find((power) => power.id === powerId)

    if (!powerToUpdate)
      throw makeErrorNotFound({
        whatsNotFound: 'Poder',
      })

    const updatedPower: IPower = {
      id: powerToUpdate.id,
      title: power.title ?? powerToUpdate.title,
      description: power.description ?? powerToUpdate.description,
    }

    const updatedPowers = [...filteredPowers, updatedPower]

    const updatedPerson = await this.personsRepository.updatePowers(
      personId,
      updatedPowers,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
