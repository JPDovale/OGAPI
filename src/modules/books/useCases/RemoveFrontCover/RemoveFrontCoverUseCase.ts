import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/provides/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  bookId: string
}

@injectable()
export class RemoveFrontCoverUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ bookId, userId }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new AppError({
        title: 'O livro não existe',
        message: 'Parece que esse livro não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const { user, project } = await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    if (!book?.frontCover.fileName) {
      throw new AppError({
        title: 'Image não encontrada.',
        message: 'Não existe uma imagem para esse livro.',
        statusCode: 404,
      })
    }

    const updatedBook = await this.booksRepository.updateFrontCover({
      id: book.id,
      frontCover: {
        fileName: '',
        url: '',
        updatedAt: this.dateProvider.getDate(new Date()),
        createdAt: book.frontCover.createdAt,
      },
    })

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} deletou a imagem do livro ${book.title} ${
        book.subtitle ? ' - ' + book.subtitle : ''
      }`,
      `${user.username} acabou de deletar a imagem do livro:  ${book.title} ${
        book.subtitle ? ' - ' + book.subtitle : ''
      } no projeto ${project.name}.`,
    )

    await this.storageProvider.delete(book.frontCover.fileName, 'books/images')

    return updatedBook
  }
}
