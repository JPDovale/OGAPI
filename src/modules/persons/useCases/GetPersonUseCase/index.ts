import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
}

interface IResponse {
  person: IPerson
}

@injectable()
export class GetPersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ personId, userId }: IRequest): Promise<IResolve<IResponse>> {
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
      verifyPermissionTo: 'view',
      verifyFeatureInProject: ['persons'],
    })

    if (response.error) {
      return {
        ok: false,
        error: response.error,
      }
    }

    return {
      ok: true,
      data: {
        person,
      },
    }
  }
}
