import { inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IWishe } from '@modules/persons/infra/mongoose/entities/Wishe'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateWisheUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    wisheId: string,
    wishe: IUpdateBaseDTO,
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

    const filteredWishes = person.wishes.filter((wishe) => wishe.id !== wisheId)
    const wisheToUpdate = person.wishes.find((wishe) => wishe.id === wisheId)

    const updatedWishe: IWishe = {
      ...wisheToUpdate,
      ...wishe,
    }

    const updatedWishes = [...filteredWishes, updatedWishe]

    const updatedPerson = await this.personsRepository.updateWishes(
      personId,
      updatedWishes,
    )

    return updatedPerson
  }
}
