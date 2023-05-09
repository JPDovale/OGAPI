import { inject, injectable } from 'tsyringe'

import { IFearsRepository } from '@modules/persons/infra/repositories/contracts/IFearsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IFear } from '@modules/persons/infra/repositories/entities/IFear'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorAlreadyExistesWithName } from '@shared/errors/useFull/makeErrorAlreadyExistesWithName'

interface IRequest {
  userId: string
  personId: string
  title: string
  description: string
}

interface IResponse {
  fear: IFear
}

@injectable()
export class CreateFearUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.FearsRepository)
    private readonly fearsRepository: IFearsRepository,
  ) {}

  async execute({
    userId,
    personId,
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

    const fearExistesToThiPerson = person.fears?.find(
      (fear) => fear.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )

    if (fearExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um medo',
      })

    const fear = await this.fearsRepository.create(
      {
        title,
        description,
        persons: {
          connect: {
            id: person.id,
          },
        },
      },
      personId,
    )

    if (!fear) throw makeErrorPersonNotUpdate()

    return { fear }
  }
}
