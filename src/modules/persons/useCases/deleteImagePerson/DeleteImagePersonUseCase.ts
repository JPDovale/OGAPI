import { inject, injectable } from 'tsyringe'

import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorImageNotFound } from '@shared/errors/useFull/makeErrorImageNotFound'

@injectable()
export class DeleteImagePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute(userId: string, personId: string): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (!person.image?.fileName) throw makeErrorImageNotFound()

    const updatedPerson = await this.personsRepository.updateImage(
      {
        fileName: '',
        url: '',
        createdAt:
          person.image.createdAt ?? this.dateProvider.getDate(new Date()),
        updatedAt: this.dateProvider.getDate(new Date()),
      },
      personId,
    )

    await this.storageProvider.delete(person.image.fileName, 'persons/images')

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
