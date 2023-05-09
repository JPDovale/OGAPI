import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  wisheId: string
}

@injectable()
export class DeleteWisheUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.WishesRepository)
    private readonly wishesRepository: IWishesRepository,
  ) {}

  async execute({ personId, userId, wisheId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const wisheToRemovePerson = await this.wishesRepository.findById(wisheId)

    if (!wisheToRemovePerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Desejo',
      })

    const numbersOfPersonInWishe = wisheToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInWishe <= 0) {
      await this.wishesRepository.delete(wisheId)
    } else {
      await this.wishesRepository.removeOnePersonById({
        objectId: wisheId,
        personId,
      })
    }
  }
}
