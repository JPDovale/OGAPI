import { inject, injectable } from 'tsyringe'

import { type IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { type IDream } from '@modules/persons/infra/mongoose/entities/Dream'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdateDreamUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    dreamId: string,
    dream: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredDreams = person.dreams.filter((dream) => dream.id !== dreamId)
    const dreamToUpdate = person.dreams.find((dream) => dream.id === dreamId)

    if (!dreamToUpdate)
      throw makeErrorNotFound({
        whatsNotFound: 'Sonho',
      })

    const updatedDream: IDream = {
      description: dream.description ?? dreamToUpdate.description,
      title: dream.title ?? dreamToUpdate.title,
      id: dreamToUpdate.id,
    }

    const updatedDreams = [...filteredDreams, updatedDream]

    const updatedPerson = await this.personsRepository.updateDreams(
      personId,
      updatedDreams,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
