import { inject, injectable } from 'tsyringe'

import { IDreamsRepository } from '@modules/persons/infra/repositories/contracts/IDreamsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IDream } from '@modules/persons/infra/repositories/entities/IDream'
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
  dream: IDream
}

@injectable()
export class CreateDreamUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.DreamsRepository)
    private readonly dreamsRepository: IDreamsRepository,
  ) {}

  async execute({
    description,
    title,
    personId,
    userId,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const dreamExistesToThiPerson = person.dreams?.find(
      (dream) =>
        dream.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )

    if (dreamExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um sonho',
      })

    const dream = await this.dreamsRepository.create({
      title,
      description,
      persons: {
        connect: {
          id: person.id,
        },
      },
    })

    if (!dream) throw makeErrorPersonNotUpdate()

    return { dream }
  }
}
