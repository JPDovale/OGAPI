import {
  // container,
  inject,
  injectable,
} from 'tsyringe'

import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IResponse {
  person: IPersonMongo
  couple: IPersonMongo
}

@injectable()
export class DeleteCoupleUseCase {
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
  ): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    const couple = await this.personsRepository.findById(coupleId)

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person || !couple) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Parece que esse personagem não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const filteredCouples = person.couples.filter(
      (couple) => couple.id !== coupleId,
    )
    const filteredCouplesOfCouple = couple.couples.filter(
      (couple) => couple.id !== personId,
    )

    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      filteredCouples,
    )
    const updatedCouple = await this.personsRepository.updateCouples(
      coupleId,
      filteredCouplesOfCouple,
    )

    return { person: updatedPerson, couple: updatedCouple }
  }
}
