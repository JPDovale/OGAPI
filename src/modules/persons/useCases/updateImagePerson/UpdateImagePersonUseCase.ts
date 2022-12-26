import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/repositories/IPersonsRepository'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'

@injectable()
export class UpdateImagePersonUseCase {
  constructor(
    @inject('PersonsRepository')
    private readonly personsRepository: IPersonsRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(
    userId: string,
    personId: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const person = await this.personsRepository.findById(personId)

    if (person.image) {
      const destruct = person.image.split('F')[2]
      const filename = destruct.split('?')[0]
      await this.storageProvider.delete(filename, 'persons/images')
    }

    const url = await this.storageProvider.upload(file, 'persons/images')

    await this.personsRepository.updateImage(url, personId)
    fs.rmSync(file.path)
  }
}
