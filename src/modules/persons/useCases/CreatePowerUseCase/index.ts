import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IPowersRepository } from '@modules/persons/infra/repositories/contracts/IPowersRepository'
import { type IPower } from '@modules/persons/infra/repositories/entities/IPower'
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
  power: IPower
}

@injectable()
export class CreatePowerUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.PowersRepository)
    private readonly powersRepository: IPowersRepository,
  ) {}

  async execute({
    personId,
    description,
    title,
    userId,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const powerExistesToThiPerson = person.powers?.find(
      (power) =>
        power.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (powerExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um poder',
      })

    const power = await this.powersRepository.create({
      title,
      description,
      persons: {
        connect: {
          id: person.id,
        },
      },
    })

    if (!power) throw makeErrorPersonNotUpdate()

    return { power }
  }
}
