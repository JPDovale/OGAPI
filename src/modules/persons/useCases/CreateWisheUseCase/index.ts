import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { type IWishe } from '@modules/persons/infra/repositories/entities/IWishe'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

interface IRequest {
  userId: string
  personId: string
  title: string
  description: string
}

interface IResponse {
  wishe: IWishe
}

@injectable()
export class CreateWisheUseCase {
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

    const wisheExistesToThiPerson = person.wishes?.find(
      (wishe) =>
        wishe.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (wisheExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um desejo',
      })

    const wishe = await this.wishesRepository.create({
      title,
      description,
      persons: {
        connect: {
          id: person.id,
        },
      },
    })

    if (!wishe) throw makeErrorPersonNotUpdate()

    return { wishe }
  }
}
