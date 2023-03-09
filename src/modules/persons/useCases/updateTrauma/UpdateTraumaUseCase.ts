import { inject, injectable } from 'tsyringe'

import { IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { ITrauma } from '@modules/persons/infra/mongoose/entities/Trauma'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    const filteredTrauma = person.traumas.filter(
      (trauma) => trauma.id !== traumaId,
    )
    const traumaToUpdate = person.traumas.find(
      (trauma) => trauma.id === traumaId,
    )

    const updatedTrauma: ITrauma = {
      ...traumaToUpdate,
      ...trauma,
    }

    const updateTrauma = [...filteredTrauma, updatedTrauma]

    const updatedPerson = await this.personsRepository.updateTraumas(
      personId,
      updateTrauma,
    )

    return updatedPerson
  }
}
