import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import {
  Avatar,
  IAvatar,
} from '@modules/accounts/infra/mongoose/entities/Avatar'
import { IPersonMongo } from '@modules/persons/infra/mongoose/entities/Person'
import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'

@injectable()
export class UpdateImagePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute(
    userId: string,
    personId: string,
    file: Express.Multer.File,
  ): Promise<IPersonMongo> {
    const person = await this.personsRepository.findById(personId)

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
    return updatedPerson
  }
}
