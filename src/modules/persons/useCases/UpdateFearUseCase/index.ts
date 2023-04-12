import { inject, injectable } from 'tsyringe'

import { IFearsRepository } from '@modules/persons/infra/repositories/contracts/IFearsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IFear } from '@modules/persons/infra/repositories/entities/IFear'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  fearId: string
  title?: string
  description?: string
}

interface IResponse {
  fear: IFear
}

@injectable()
export class UpdateFearUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.FearsRepository)
    private readonly fearsRepository: IFearsRepository,
  ) {}

  async execute({
    fearId,
    personId,
    userId,
    description,
    title,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const fearToUpdate = await this.fearsRepository.findById(fearId)

    if (!fearToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Medo',
      })
    }

    const updatedFear = await this.fearsRepository.update({
      fearId,
      data: {
        title,
        description,
      },
    })

    if (!updatedFear) throw makeErrorPersonNotUpdate()

    return { fear: updatedFear }
  }
}
