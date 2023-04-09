import { inject, injectable } from 'tsyringe'

import { type IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { type ICouple } from '@modules/persons/infra/mongoose/entities/Couple'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

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

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredCouples = person.couples.filter(
      (couple) => couple.id !== coupleId,
    )
    const coupleToUpdate = person.couples.find(
      (couple) => couple.id === coupleId,
    )

    if (!coupleToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Casal',
      })
    }

    const updatedCouple: ICouple = {
      description: couple.description ?? coupleToUpdate.description,
      title: couple.title ?? coupleToUpdate.title,
      final: coupleToUpdate.final,
      personId: coupleToUpdate.personId,
      id: coupleToUpdate.id,
    }

    const updatedCouples = [...filteredCouples, updatedCouple]

    const updatedPerson = await this.personsRepository.updateCouples(
      personId,
      updatedCouples,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
