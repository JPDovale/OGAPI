import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorImageNotFound } from '@shared/errors/useFull/makeErrorImageNotFound'

interface IRequest {
  userId: string
  bookId: string
}

@injectable()
export class RemoveFrontCoverUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Providers.StorageProvider)
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute({ bookId, userId }: IRequest): Promise<void> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()

    const { user, project } = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    if (!book.front_cover_filename) throw makeErrorImageNotFound()

    await this.booksRepository.update({
      bookId,
      data: { front_cover_filename: null, front_cover_url: null },
    })

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} deletou a imagem do livro ${book.title} ${
        book.subtitle ? ' - ' + book.subtitle : ''
      }`,
      content: `${user.username} acabou de deletar a imagem do livro:  ${
        book.title
      } ${book.subtitle ? ' - ' + book.subtitle : ''} no projeto ${
        project.name
      }.`,
    })

    await this.storageProvider.delete(book.front_cover_filename, 'books/images')
  }
}
