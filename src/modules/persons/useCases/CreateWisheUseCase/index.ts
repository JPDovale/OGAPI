import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { type IWishe } from '@modules/persons/infra/repositories/entities/IWishe'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

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
  }: IRequest): Promise<IResolve<IResponse>> {
    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }

    const response = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    const wisheExistesToThiPerson = person.wishes?.find(
      (wishe) =>
        wishe.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (wisheExistesToThiPerson) {
      return {
        ok: false,
        error: makeErrorAlreadyExistesWithName({
          whatExistes: 'um desejo',
        }),
      }
    }

    const wishe = await this.wishesRepository.create(
      {
        title,
        description,
        persons: {
          connect: {
            id: person.id,
          },
        },
      },
      personId,
    )

    if (!wishe) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        wishe,
      },
    }
  }
}
