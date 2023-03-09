import { inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { IAppearance } from '@modules/persons/infra/mongoose/entities/Appearance'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    const filteredAppearances = person.appearance.filter(
      (appearance) => appearance.id !== appearanceId,
    )
    const appearanceToUpdate = person.appearance.find(
      (appearance) => appearance.id === appearanceId,
    )

    const updatedAppearance: IAppearance = {
      ...appearanceToUpdate,
      ...appearance,
    }

    const updatedAppearances = [...filteredAppearances, updatedAppearance]

    const updatedPerson = await this.personsRepository.updateAppearance(
      personId,
      updatedAppearances,
    )

    return updatedPerson
  }
}
