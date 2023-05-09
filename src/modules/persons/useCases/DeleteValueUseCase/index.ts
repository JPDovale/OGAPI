import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IValuesRepository } from '@modules/persons/infra/repositories/contracts/IValuesRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  valueId: string
}

@injectable()
export class DeleteValueUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ValuesRepository)
    private readonly valuesRepository: IValuesRepository,
  ) {}

  async execute({ personId, valueId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const valueToRemovePerson = await this.valuesRepository.findById(valueId)

    if (!valueToRemovePerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Valor',
      })

    const numbersOfPersonInValue = valueToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInValue <= 0) {
      await this.valuesRepository.delete(valueId)
    } else {
      await this.valuesRepository.removeOnePersonById({
        objectId: valueId,
        personId,
      })
    }
  }
}
