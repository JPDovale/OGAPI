import { inject, injectable } from 'tsyringe'

import { type IArchive } from '@modules/boxes/infra/mongoose/entities/types/IArchive'
import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'
import { makeErrorImageNotFound } from '@shared/errors/useFull/makeErrorImageNotFound'

interface IRequest {
  boxId: string
  archiveId: string
  imageId: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class DeleteImageInArchiveUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({ archiveId, boxId, imageId }: IRequest): Promise<IResponse> {
    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    const archive = box.archives.find((a) => a.archive.id === archiveId)
    const filteredArchives = box.archives.filter(
      (a) => a.archive.id !== archiveId,
    )
    if (!archive) throw makeErrorArchiveNotFound()

    const archiveUpdated: IArchive = {
      ...archive,
      archive: {
        ...archive.archive,
        updatedAt: this.dateProvider.getDate(new Date()),
      },
      images: archive.images.filter((i) => i.id !== imageId),
    }

    const updatedArchives: IArchive[] = [...filteredArchives, archiveUpdated]
    const imageToDelete = archive.images.find((i) => i.id === imageId)

    if (!imageToDelete) throw makeErrorImageNotFound()

    const updatedBox = await this.boxesRepository.updateArchives({
      id: box.id,
      archives: updatedArchives,
    })

    await this.storageProvider.delete(
      imageToDelete.fileName,
      'boxes/archives/images',
    )
    if (!updatedBox) throw makeErrorBoxNotUpdate()

    return { box: updatedBox }
  }
}
