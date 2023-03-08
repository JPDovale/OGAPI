import { inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { IDream } from '@modules/persons/infra/mongoose/entities/Dream'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateDreamUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    dreamId: string,
    dream: IUpdateBaseDTO,
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

    const filteredDreams = person.dreams.filter((dream) => dream.id !== dreamId)
    const dreamToUpdate = person.dreams.find((dream) => dream.id === dreamId)

    const updatedDream: IDream = {
      ...dreamToUpdate,
      ...dream,
    }

    const updatedDreams = [...filteredDreams, updatedDream]

    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedDreams,
    )

    return updatedPerson
  }
}
