import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IWishesRepository } from '@modules/persons/infra/repositories/contracts/IWishesRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

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

  async execute({ personId, userId, wisheId }: IRequest): Promise<IResolve> {
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

    const wisheToRemovePerson = await this.wishesRepository.findById(wisheId)

    if (!wisheToRemovePerson) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Desejo',
        }),
      }
    }

    const numbersOfPersonInWishe = wisheToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInWishe <= 0) {
      await this.wishesRepository.delete(wisheId)
    } else {
      await this.wishesRepository.removeOnePersonById({
        objectId: wisheId,
        personId,
      })
    }

    return {
      ok: true,
    }
  }
}
