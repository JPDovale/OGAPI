import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import {
  Avatar,
  type IAvatar,
} from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorPersonNotUpdate } from '@shared/errors/persons/makeErrorPersonNotUpdate'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'

@injectable()
export class UpdateImagePersonUseCase {
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

  async execute(
    userId: string,
    personId: string,
    file: Express.Multer.File | undefined,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()
    if (!file) throw makeErrorFileNotUploaded()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.defaultProject,
      verifyPermissionTo: 'edit',
    })

    if (person?.image?.fileName) {
      await this.storageProvider.delete(person.image.fileName, 'persons/images')
    }

    const url = await this.storageProvider.upload(file, 'persons/images')
    let avatarToUpdate: IAvatar

    if (person?.image?.fileName) {
      const avatar: IAvatar = {
        ...person.image,
        fileName: file.filename,
        url,
        updatedAt: this.dateProvider.getDate(new Date()),
      }

      avatarToUpdate = avatar
    } else {
      const avatar = new Avatar({
        fileName: file.filename,
        url,
      })

      avatarToUpdate = avatar
    }

    const updatedPerson = await this.personsRepository.updateImage(
      avatarToUpdate,
      personId,
    )

    fs.rmSync(file.path)

    if (!updatedPerson) throw makeErrorPersonNotUpdate()

    return updatedPerson
  }
}
