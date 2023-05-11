import { inject, injectable } from 'tsyringe'

import { IDreamsRepository } from '@modules/persons/infra/repositories/contracts/IDreamsRepository'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
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
export class ReferenceDreamUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.DreamsRepository)
    private readonly dreamsRepository: IDreamsRepository,
  ) {}

  async execute({ personId, refId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const dreamToAddPerson = await this.dreamsRepository.findById(refId)

    if (!dreamToAddPerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Sonho',
      })

    await this.dreamsRepository.addPerson({
      personId: person.id,
      objectId: refId,
    })
  }
}
