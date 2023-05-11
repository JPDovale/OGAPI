import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { type IWishe } from '@modules/persons/infra/repositories/entities/IWishe'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  wisheId: string
  title?: string
  description?: string
}

interface IResponse {
  wishe: IWishe
}

@injectable()
export class UpdateWisheUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.WishesRepository)
    private readonly wishesRepository: IWishesRepository,
  ) {}

  async execute({
    personId,
    userId,
    wisheId,
    description,
    title,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const wisheToUpdate = await this.wishesRepository.findById(wisheId)

    if (!wisheToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Desejo',
      })
    }

    const updatedWishe = await this.wishesRepository.update({
      wisheId,
      data: {
        title,
        description,
      },
    })

    if (!updatedWishe) throw makeErrorPersonNotUpdate()

    return { wishe: updatedWishe }
  }
}
