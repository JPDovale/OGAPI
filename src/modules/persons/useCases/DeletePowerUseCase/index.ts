import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IPowersRepository } from '@modules/persons/infra/repositories/contracts/IPowersRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  powerId: string
}

@injectable()
export class DeletePowerUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.PowersRepository)
    private readonly powersRepository: IPowersRepository,
  ) {}

  async execute({ personId, powerId, userId }: IRequest): Promise<IResolve> {
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

    const powerToRemovePerson = await this.powersRepository.findById(powerId)

    if (!powerToRemovePerson) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Poder',
        }),
      }
    }

    const numbersOfPersonInPower = powerToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInPower <= 0) {
      await this.powersRepository.delete(powerId)
    } else {
      await this.powersRepository.removeOnePersonById({
        objectId: powerId,
        personId,
      })
    }

    return {
      ok: true,
    }
  }
}
