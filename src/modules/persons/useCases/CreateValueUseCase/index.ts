import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IValuesRepository } from '@modules/persons/infra/repositories/contracts/IValuesRepository'
import { type IValue } from '@modules/persons/infra/repositories/entities/IValue'
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
  exceptions?: Array<{
    title: string
    description: string
  }>
}

interface IResponse {
  value: IValue
}

@injectable()
export class CreateValueUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ValuesRepository)
    private readonly valuesRepository: IValuesRepository,
  ) {}

  async execute({
    personId,
    userId,
    description,
    title,
    exceptions,
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const valueExistesToThiPerson = person.values?.find(
      (value) =>
        value.title.toLowerCase().trim() === title.toLowerCase().trim(),
    )
    if (valueExistesToThiPerson)
      throw makeErrorAlreadyExistesWithName({
        whatExistes: 'um valor',
      })

    const value = await this.valuesRepository.create(
      {
        title,
        description,
        exceptions: {
          createMany: {
            data: exceptions ?? [],
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

    if (!value) throw makeErrorPersonNotUpdate()

    return { value }
  }
}
