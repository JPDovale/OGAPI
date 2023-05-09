import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { IImagesRepository } from '@modules/boxes/infra/repositories/contracts/IImagesRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorArchiveNotFound } from '@shared/errors/boxes/makeErrorArchiveNotFound'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeErrorImageNotFound } from '@shared/errors/useFull/makeErrorImageNotFound'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  boxId: string
  archiveId: string
  imageId: string
  userId: string
}

@injectable()
export class DeleteImageInArchiveUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,

    @inject(InjectableDependencies.Repositories.ImagesRepository)
    private readonly imagesRepository: IImagesRepository,
  ) {}

  async execute({ boxId, imageId, userId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()
    if (!box.archives) throw makeErrorArchiveNotFound()

    if (box.user_id !== userId) throw makeErrorAccessDenied()

    const image = await this.imagesRepository.findById(imageId)
    if (!image) throw makeErrorImageNotFound()

    await this.imagesRepository.delete(imageId)

    await this.storageProvider.delete(
      image.image_filename,
      'boxes/archives/images',
    )
  }
}
