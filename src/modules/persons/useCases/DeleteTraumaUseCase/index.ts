import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ITraumasRepository } from '@modules/persons/infra/repositories/contracts/ITraumasRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

interface IRequest {
  userId: string
  personId: string
  traumaId: string
}

@injectable()
export class DeleteTraumaUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.TraumasRepository)
    private readonly traumasRepository: ITraumasRepository,
  ) {}

  async execute({ personId, traumaId, userId }: IRequest): Promise<void> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    const traumaToRemovePerson = await this.traumasRepository.findById(traumaId)

    if (!traumaToRemovePerson)
      throw makeErrorNotFound({
        whatsNotFound: 'Trauma',
      })

    const numbersOfPersonInTrauma = traumaToRemovePerson.persons?.length ?? 0

    if (numbersOfPersonInTrauma <= 0) {
      await this.traumasRepository.delete(traumaId)
    } else {
      await this.traumasRepository.removeOnePersonById({
        objectId: traumaId,
        personId,
      })
    }
  }
}
