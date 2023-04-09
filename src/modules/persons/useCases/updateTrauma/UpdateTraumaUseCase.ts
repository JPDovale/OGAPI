import { inject, injectable } from 'tsyringe'

import { type IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdateTraumaUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    traumaId: string,
    trauma: IUpdateTraumaDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredTrauma = person.traumas.filter(
      (trauma) => trauma.id !== traumaId,
    )
    const traumaToUpdate = person.traumas.find(
      (trauma) => trauma.id === traumaId,
    )

    if (!traumaToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Trauma',
      })
    }

    const updatedTrauma: ITrauma = {
      consequences: trauma.consequences ?? traumaToUpdate.consequences,
      title: trauma.title ?? traumaToUpdate.title,
      description: trauma.description ?? traumaToUpdate.description,
      id: traumaToUpdate.id,
    }

    const updateTrauma = [...filteredTrauma, updatedTrauma]

    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updateTrauma,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
