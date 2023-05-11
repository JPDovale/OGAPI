import { inject, injectable } from 'tsyringe'

import { IAppearancesRepository } from '@modules/persons/infra/repositories/contracts/IAppearancesRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IAppearance } from '@modules/persons/infra/repositories/entities/IAppearance'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  appearanceId: string
  title?: string
  description?: string
}

interface IResponse {
  appearance: IAppearance
}

@injectable()
export class UpdateAppearanceUseCase {
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

    const appearanceToEdit = await this.appearancesRepository.findById(
      appearanceId,
    )

    if (!appearanceToEdit)
      throw makeErrorNotFound({
        whatsNotFound: 'Aparência',
      })

    const appearanceUpdated = await this.appearancesRepository.update({
      appearanceId,
      data: {
        title,
        description,
      },
    })

    if (!appearanceUpdated) throw makeErrorPersonNotUpdate()

    return { appearance: appearanceUpdated }
  }
}
