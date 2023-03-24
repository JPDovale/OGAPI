import { inject, injectable } from 'tsyringe'

import { type IBox } from '@modules/boxes/infra/mongoose/entities/types/IBox'
import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorBoxNotUpdate } from '@shared/errors/boxes/makeErrorBoxNotUpdate'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'

interface IRequest {
  boxId: string
  archiveId: string
}

interface IResponse {
  box: IBox
}

@injectable()
export class DeleteArchiveUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({ archiveId, boxId }: IRequest): Promise<IResponse> {
    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    const archive = box.archives.find((a) => a.archive.id === archiveId)
    if (!archive) throw makeErrorArchiveNotFound()

    const updatedArchives = box.archives.filter(
      (a) => a.archive.id !== archiveId,
    )

    const updatedBox = await this.boxesRepository.updateArchives({
      archives: updatedArchives,
      id: box.id,
    })

    if (!updatedBox) throw makeErrorBoxNotUpdate()

    if (archive.images.length > 0) {
      Promise.all(
        archive.images.map(async (image) => {
          await this.storageProvider.delete(
            image.fileName,
            'boxes/archives/images',
          )
        }),
      ).catch((err) => {
        console.log(err)
        throw makeInternalError()
      })
    }

    return { box: updatedBox }
  }
}
