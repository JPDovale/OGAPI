import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { type IPerson } from '@modules/persons/infra/repositories/entities/IPerson'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

interface IRequest {
  userId: string
  personId: string
  name?: string
  lastName?: string
  history?: string
  age?: number
}

interface IResponse {
  person: IPerson
}

@injectable()
export class UpdatePersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    personId,
    userId,
    age,
    history,
    lastName,
    name,
  }: IRequest): Promise<IResponse> {
    const personExite = await this.personsRepository.findById(personId)
    if (!personExite) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: personExite.project_id,
      verifyPermissionTo: 'edit',
    })

    const updatedPerson = await this.personsRepository.updatePerson({
      personId,
      data: {
        age,
        history,
        name,
        last_name: lastName,
      },
    })
    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return { person: updatedPerson }
  }
}
