import fs from 'node:fs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IArchivesRepository } from '@modules/boxes/infra/repositories/contracts/IArchivesRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { IImagesRepository } from '@modules/boxes/infra/repositories/contracts/IImagesRepository'
import { type IImage } from '@modules/boxes/infra/repositories/entities/IImage'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  userId: string
  boxId: string
  archiveId: string
  file: Express.Multer.File | undefined
}

interface IResponse {
  image: IImage
}

@injectable()
export class SaveImageUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.ImagesRepository)
    private readonly imagesRepository: IImagesRepository,

    @inject(InjectableDependencies.Repositories.ArchivesRepository)
    private readonly archivesRepository: IArchivesRepository,
  ) {}

  async execute({
    file,
    userId,
    boxId,
    archiveId,
  }: IRequest): Promise<IResponse> {
    if (!file) throw makeErrorFileNotUploaded()

    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    if (box.user_id !== user.id) throw makeErrorAccessDenied()

    const archive = await this.archivesRepository.findById(archiveId)
    if (!archive) throw makeErrorArchiveNotFound()

    const numberOfImagesInGallery = archive.gallery?.length ?? 0

    if (numberOfImagesInGallery >= 3 && !user.last_payment_date && !user.admin)
      throw makeErrorLimitFreeInEnd()

    const url = await this.storageProvider.upload(file, 'boxes/archives/images')

    const image = await this.imagesRepository.create({
      image_filename: file.filename,
      image_url: url,
      archive_id: archive.id,
    })

    fs.rmSync(file.path)
    if (!image) throw makeErrorFileNotUploaded()

    return { image }
  }
}
