import { inject, injectable } from 'tsyringe'

import { IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UpdateCoupleUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    coupleId: string,
    couple: IUpdateBaseDTO,
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

    const filteredCouples = person.couples.filter(
      (couple) => couple.id !== coupleId,
    )
    const coupleToUpdate = person.couples.find(
      (couple) => couple.id === coupleId,
    )

    const updatedCouple: ICouple = {
      ...coupleToUpdate,
      ...couple,
    }

    const updatedCouples = [...filteredCouples, updatedCouple]

    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      updatedCouples,
    )

    return updatedPerson
  }
}
