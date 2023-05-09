import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import { IBoxesRepository } from '@modules/boxes/infra/repositories/contracts/IBoxesRepository'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBoxNotFound } from '@shared/errors/boxes/makeErrorBoxNotFound'
import { makeErrorAccessDenied } from '@shared/errors/useFull/makeErrorAccessDenied'
import { makeInternalError } from '@shared/errors/useFull/makeInternalError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IRequest {
  boxId: string
  userId: string
}

@injectable()
export class DeleteBoxUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BoxesRepository)
    private readonly boxesRepository: IBoxesRepository,

    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({ boxId, userId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw makeErrorUserNotFound()

    const box = await this.boxesRepository.findById(boxId)
    if (!box) throw makeErrorBoxNotFound()

    if (box.user_id !== userId) throw makeErrorAccessDenied()

    const filesNamesImagesToDelete: string[] = []
    await this.boxesRepository.delete(boxId)

    box.archives?.map((a) =>
      a.gallery?.map((image) =>
        filesNamesImagesToDelete.push(image.image_filename),
      ),
    )

    if (filesNamesImagesToDelete.length > 0) {
      Promise.all(
        filesNamesImagesToDelete.map(async (fileName) => {
          await this.storageProvider.delete(fileName, 'boxes/archives/images')
        }),
      ).catch((err) => {
        console.log(err)
        throw makeInternalError()
      })
    }
  }
}
