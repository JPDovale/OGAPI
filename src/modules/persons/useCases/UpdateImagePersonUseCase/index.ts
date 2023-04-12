import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'

interface IRequest {
  userId: string
  personId: string
  file: Express.Multer.File | undefined
}

interface IResponse {
  imageFilename: string
  imageUrl: string
}

@injectable()
export class UpdateImagePersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ file, personId, userId }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)

    if (!person) throw makeErrorPersonNotFound()
    if (!file) throw makeErrorFileNotUploaded()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'edit',
    })

    if (person.image_filename) {
      await this.storageProvider.delete(person.image_filename, 'persons/images')
    }

    const url = await this.storageProvider.upload(file, 'persons/images')

    await this.personsRepository.updateImage({
      personId,
      image_filename: file.filename,
      image_url: url,
    })

    fs.rmSync(file.path)

    return {
      imageFilename: file.filename,
      imageUrl: url,
    }
  }
}
