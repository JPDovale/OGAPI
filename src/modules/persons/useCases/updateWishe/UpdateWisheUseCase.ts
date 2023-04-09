import { inject, injectable } from 'tsyringe'

import { type IUpdateBaseDTO } from '@modules/persons/dtos/IUpdateBaseDTO'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { type IWishe } from '@modules/persons/infra/mongoose/entities/Wishe'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'

@injectable()
export class UpdateWisheUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(
    userId: string,
    personId: string,
    wisheId: string,
    wishe: IUpdateBaseDTO,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    const filteredWishes = person.wishes.filter((wishe) => wishe.id !== wisheId)
    const wisheToUpdate = person.wishes.find((wishe) => wishe.id === wisheId)

    if (!wisheToUpdate) {
      throw makeErrorNotFound({
        whatsNotFound: 'Desejo',
      })
    }

    const updatedWishe: IWishe = {
      description: wishe.description ?? wisheToUpdate.description,
      title: wishe.title ?? wisheToUpdate.title,
      id: wisheToUpdate.id,
    }

    const updatedWishes = [...filteredWishes, updatedWishe]

    const updatedPerson = await this.personsRepository.updateWishes(
      personId,
      updatedWishes,
    )

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
