import { inject, injectable } from 'tsyringe'

import { type IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { type IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdateAppearanceUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    appearanceId: string,
    appearance: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredAppearances = person.appearance.filter(
      (appearance) => appearance.id !== appearanceId,
    )
    const appearanceToUpdate = person.appearance.find(
      (appearance) => appearance.id === appearanceId,
    )

    if (!appearanceToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Aparência',
      })
    }

    const updatedAppearance: IAppearance = {
      title: appearance.title ?? appearanceToUpdate.title,
      description: appearance.description ?? appearanceToUpdate.description,
      id: appearanceToUpdate.id,
    }

    const updatedAppearances = [...filteredAppearances, updatedAppearance]

    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedAppearances,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
