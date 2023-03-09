import { inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { IFear } from '@modules/persons/infra/mongoose/entities/Fear'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    const filteredFears = person.fears.filter((fear) => fear.id !== fearId)
    const fearToUpdate = person.fears.find((fear) => fear.id === fearId)

    const updatedFear: IFear = {
      ...fearToUpdate,
      ...fear,
    }

    const updatedFears = [...filteredFears, updatedFear]

    const updatedPerson = await this.personsRepository.updateFears(
      personId,
      updatedFears,
    )

    return updatedPerson
  }
}
