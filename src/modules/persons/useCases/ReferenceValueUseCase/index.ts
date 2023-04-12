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
  refId: string
}
@injectable()
export class ReferenceValueUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.ValuesRepository)
    private readonly valuesRepository: IValuesRepository,
  ) {}

  async execute({ personId, refId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const valueToAddPerson = await this.valuesRepository.findById(refId)

    if (!valueToAddPerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Valor',
      })

    await this.valuesRepository.addPerson({
      personId: person.id,
      objectId: refId,
    })
  }
}
