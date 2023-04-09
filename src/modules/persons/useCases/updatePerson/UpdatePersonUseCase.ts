import { inject, injectable } from 'tsyringe'

import { type ICreatePersonDTO } from '@modules/persons/dtos/ICreatePersonDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'

@injectable()
export class UpdatePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    person: ICreatePersonDTO,
  ): Promise<IPersonMongo> {
    const personExite = await this.personsRepository.findById(personId)

    if (!personExite) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: personExite.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const updatedPerson = await this.personsRepository.updatePerson(
      personId,
      person,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
