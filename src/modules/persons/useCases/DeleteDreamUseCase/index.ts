import { inject, injectable } from 'tsyringe'

import { IDreamsRepository } from '@modules/persons/infra/repositories/contracts/IDreamsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  dreamId: string
}

@injectable()
export class DeleteDreamUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.DreamsRepository)
    private readonly dreamsRepository: IDreamsRepository,
  ) {}

  async execute({ dreamId, personId, userId }: IRequest): Promise<IResolve> {
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

    const dreamToRemovePerson = await this.dreamsRepository.findById(dreamId)

    if (!dreamToRemovePerson) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Sonho',
        }),
      }
    }

    const numbersOfPersonInDream = dreamToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInDream <= 0) {
      await this.dreamsRepository.delete(dreamId)
    } else {
      await this.dreamsRepository.removeOnePersonById({
        objectId: dreamId,
        personId,
      })
    }

    return {
      ok: true,
    }
  }
}
