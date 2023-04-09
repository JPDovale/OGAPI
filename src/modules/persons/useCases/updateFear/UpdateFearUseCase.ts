import { inject, injectable } from 'tsyringe'

import { type IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { type IFear } from '@modules/persons/infra/mongoose/entities/Fear'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdateFearUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    fearId: string,
    fear: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredFears = person.fears.filter((fear) => fear.id !== fearId)
    const fearToUpdate = person.fears.find((fear) => fear.id === fearId)

    if (!fearToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Medo',
      })
    }

    const updatedFear: IFear = {
      description: fear.description ?? fearToUpdate.description,
      title: fear.title ?? fearToUpdate.title,
      id: fearToUpdate.id,
    }

    const updatedFears = [...filteredFears, updatedFear]

    const updatedPerson = await this.personsRepository.updateFears(
      personId,
      updatedFears,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
