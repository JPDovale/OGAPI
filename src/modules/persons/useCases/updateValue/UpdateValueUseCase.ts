import { inject, injectable } from 'tsyringe'

import { IUpdateValueDTO } from '@modules/persons/dtos/IUpdateValueDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IValue } from '@modules/persons/infra/mongoose/entities/Value'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person) {
      throw new AppError({
        title: 'O personagem não existe',
        message: 'Você está tentando atualizar um personagem que não existe.',
        statusCode: 404,
      })
    }

    const filteredValues = person.values.filter((value) => value.id !== valueId)
    const valueToUpdate = person.values.find((value) => value.id === valueId)

    const updatedValeu: IValue = {
      ...valueToUpdate,
      ...value,
    }

    const updatedValues = [...filteredValues, updatedValeu]

    const updatedPerson = await this.personsRepository.updateValues(
      personId,
      updatedValues,
    )

    return updatedPerson
  }
}
