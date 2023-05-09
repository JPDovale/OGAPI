import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IValuesRepository } from '@modules/persons/infra/repositories/contracts/IValuesRepository'
import { type ITrauma } from '@modules/persons/infra/repositories/entities/ITrauma'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  valueId: string
  title?: string
  description?: string
}

interface IResponse {
  value: ITrauma
}

@injectable()
export class UpdateValueUseCase {
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
    valueId,
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

    const valueToUpdate = await this.valuesRepository.findById(valueId)

    if (!valueToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Valor',
      })
    }

    const updatedValeu = await this.valuesRepository.update({
      valueId,
      data: {
        title,
        description,
      },
    })

    if (!updatedValeu) throw makeErrorPersonNotUpdate()

    return { value: updatedValeu }
  }
}
