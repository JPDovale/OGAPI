import { inject, injectable } from 'tsyringe'

import { IAppearancesRepository } from '@modules/persons/infra/repositories/contracts/IAppearancesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  appearanceId: string
}

@injectable()
export class DeleteAppearanceUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.AppearancesRepository)
    private readonly appearancesRepository: IAppearancesRepository,
  ) {}

  async execute({
    appearanceId,
    personId,
    userId,
  }: IRequest): Promise<IResolve> {
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

    const appearanceToRemovePerson = await this.appearancesRepository.findById(
      appearanceId,
    )

    if (!appearanceToRemovePerson) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Aparência',
        }),
      }
    }

    const numbersOfPersonInAppearance =
      appearanceToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInAppearance <= 0) {
      await this.appearancesRepository.delete(appearanceId)
    } else {
      await this.appearancesRepository.removeOnePersonById({
        objectId: appearanceId,
        personId,
      })
    }

    return {
      ok: true,
    }
  }
}
