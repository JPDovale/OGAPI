import { inject, injectable } from 'tsyringe'

import { ICouplesRepository } from '@modules/persons/infra/repositories/contracts/ICouplesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  personId: string
  coupleId: string
  userId: string
}

@injectable()
export class DeleteCoupleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CouplesRepository)
    private readonly couplesRepository: ICouplesRepository,
  ) {}

  async execute({ userId, personId, coupleId }: IRequest): Promise<IResolve> {
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

    await this.couplesRepository.delete(coupleId)

    return {
      ok: true,
    }
  }
}
