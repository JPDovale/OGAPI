import { inject, injectable } from 'tsyringe'

import { IFearsRepository } from '@modules/persons/infra/repositories/contracts/IFearsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  refId: string
}

@injectable()
export class ReferenceFearUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.FearsRepository)
    private readonly fearsRepository: IFearsRepository,
  ) {}

  async execute({ personId, refId, userId }: IRequest): Promise<IResolve> {
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

    const fearToAddPerson = await this.fearsRepository.findById(refId)

    if (!fearToAddPerson) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Medo',
        }),
      }
    }

    await this.fearsRepository.addPerson({
      personId: person.id,
      objectId: refId,
    })

    return {
      ok: true,
    }
  }
}
