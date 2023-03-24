import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IImageArchive } from '@modules/boxes/infra/mongoose/entities/schemas/Archive'
import { type IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
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
  box: IBox
}

@injectable()
export class SaveImageUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
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

    const archive = box.archives.find(
      (archive) => archive.archive.id === archiveId,
    )
    const archivesFiltered = box.archives.filter(
      (archive) => archive.archive.id !== archiveId,
    )
    if (!archive) throw makeErrorArchiveNotFound()

    if (archive.images.length >= 5 && !user.payed && !user.admin)
      throw makeErrorLimitFreeInEnd()

    const url = await this.storageProvider.upload(file, 'boxes/archives/images')

    const newImage: IImageArchive = {
      fileName: file.filename,
      url,
      id: randomUUID(),
      createdAt: this.dateProvider.getDate(new Date()),
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const archiveUpdated: IArchive = {
      ...archive,
      archive: {
        ...archive.archive,
        updatedAt: this.dateProvider.getDate(new Date()),
      },
      images: [...archive.images, newImage],
    }

    const archivesUpdated: IArchive[] = [...archivesFiltered, archiveUpdated]

    const boxUpdated = await this.boxesRepository.updateArchives({
      id: box.id,
      archives: archivesUpdated,
    })

    if (!boxUpdated) throw makeErrorFileNotUploaded()

    fs.rmSync(file.path)
    return { box: boxUpdated }
  }
}
