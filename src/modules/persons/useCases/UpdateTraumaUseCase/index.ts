import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ITraumasRepository } from '@modules/persons/infra/repositories/contracts/ITraumasRepository'
import { type ITrauma } from '@modules/persons/infra/repositories/entities/ITrauma'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  traumaId: string
  title?: string
  description?: string
}

interface IResponse {
  trauma: ITrauma
}

@injectable()
export class UpdateTraumaUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TraumasRepository)
    private readonly traumasRepository: ITraumasRepository,
  ) {}

  async execute({
    personId,
    traumaId,
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

    const verification = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['persons'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const traumaToUpdate = await this.traumasRepository.findById(traumaId)

    if (!traumaToUpdate) {
      return {
        ok: false,
        error: makeErrorNotFound({
          whatsNotFound: 'Trauma',
        }),
      }
    }

    const updatedTrauma = await this.traumasRepository.update({
      traumaId,
      data: {
        title,
        description,
      },
    })

    if (!updatedTrauma) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        trauma: updatedTrauma,
      },
    }
  }
}
