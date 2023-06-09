import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ITraumasRepository } from '@modules/persons/infra/repositories/contracts/ITraumasRepository'
import { type ITrauma } from '@modules/persons/infra/repositories/entities/ITrauma'
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
  consequences?: Array<{
    title: string
    description: string
  }>
}

interface IResponse {
  trauma: ITrauma
}

@injectable()
export class CreateTraumaUseCase {
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
    userId,
    description,
    title,
    consequences,
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

    const traumaExistesToThiPerson = person.traumas?.find(
      (trauma) =>
        trauma.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (traumaExistesToThiPerson) {
      return {
        ok: false,
        error: makeErrorAlreadyExistesWithName({
          whatExistes: 'um trauma',
        }),
      }
    }

    const trauma = await this.traumasRepository.create(
      {
        title,
        description,
        consequences: {
          createMany: {
            data: consequences ?? [],
          },
        },
        persons: {
          connect: {
            id: person.id,
          },
        },
      },
      personId,
    )

    if (!trauma) {
      return {
        ok: false,
        error: makeErrorPersonNotUpdate(),
      }
    }

    return {
      ok: true,
      data: {
        trauma,
      },
    }
  }
}
