import { inject, injectable } from 'tsyringe'

import { IBoxesRepository } from '@modules/boxes/infra/mongoose/repositories/IBoxesRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'

interface IRequest {
  boxId: string
}

@injectable()
export class DeleteBoxUseCase {
  constructor(
    @inject('BoxesRepository')
    private readonly boxesRepository: IBoxesRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({ boxId }: IRequest): Promise<void> {
    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    const filesNameImageToDelete: string[] = []

    await this.boxesRepository.deletePerId(boxId)

    box.archives?.map((a) => {
      return a.images?.map((image) =>
        filesNameImageToDelete.push(image.fileName),
      )
    })

    if (filesNameImageToDelete.length > 0) {
      Promise.all(
        filesNameImageToDelete.map(async (fileName) => {
          await this.storageProvider.delete(fileName, 'boxes/archives/images')
        }),
      ).catch((err) => {
        console.log(err)
        throw makeInternalError()
      })
    }
  }
}
