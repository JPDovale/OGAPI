import {
  // container,
  inject,
  injectable,
} from 'tsyringe'

import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

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

    if (!person && !couple) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

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

    if (!updatedPerson) throw makeErrorPersonNotUpdate()
    if (!updatedCouple) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson, couple: updatedCouple }
  }
}
