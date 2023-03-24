import { inject, injectable } from 'tsyringe'

import { type IUpdateValueDTO } from '@modules/persons/dtos/IUpdateValueDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type IValue } from '@modules/persons/infra/mongoose/entities/Value'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdateValueUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    valueId: string,
    value: IUpdateValueDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredValues = person.values.filter((value) => value.id !== valueId)
    const valueToUpdate = person.values.find((value) => value.id === valueId)

    if (!valueToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Valor',
      })
    }

    const updatedValeu: IValue = {
      description: value.description ?? valueToUpdate.description,
      title: value.title ?? valueToUpdate.title,
      id: valueToUpdate.id,
      exceptions: value.exceptions ?? valueToUpdate.exceptions,
    }

    const updatedValues = [...filteredValues, updatedValeu]

    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      updatedValues,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
