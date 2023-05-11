import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IArchivesRepository } from '@modules/boxes/infra/repositories/contracts/IArchivesRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  boxId: string
  archiveId: string
  userId: string
}

@injectable()
export class DeleteArchiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.ArchivesRepository)
    private readonly archivesRepository: IArchivesRepository,
  ) {}

  async execute({ archiveId, boxId, userId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()
    if (!box.archives) throw makeErrorArchiveNotFound()

    if (box.user_id !== userId) throw makeErrorAccessDenied()

    const archive = await this.archivesRepository.findById(archiveId)
    if (!archive) throw makeErrorArchiveNotFound()

    await this.archivesRepository.delete(archiveId)

    const numberOfImagesInGallery = archive.gallery?.length ?? 0

    if (numberOfImagesInGallery > 0 && archive.gallery) {
      Promise.all(
        archive.gallery.map(async (image) => {
          await this.storageProvider.delete(
            image.image_filename,
            'boxes/archives/images',
          )
        }),
      ).catch((err) => {
        console.log(err)
        throw makeInternalError()
      })
    }
  }
}
