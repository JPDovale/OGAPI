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
  refId: string
}

@injectable()
export class ReferenceWisheUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.WishesRepository)
    private readonly wishesRepository: IWishesRepository,
  ) {}

  async execute({ personId, refId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const wisheToAddPerson = await this.wishesRepository.findById(refId)

    if (!wisheToAddPerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Desejo',
      })

    await this.wishesRepository.addPerson({
      personId: person.id,
      objectId: refId,
    })
  }
}
