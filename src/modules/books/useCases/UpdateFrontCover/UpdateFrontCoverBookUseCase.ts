import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import {
  Avatar,
  IAvatar,
} from '@modules/accounts/infra/mongoose/entities/Avatar'
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
  file: Express.Multer.File
}

@injectable()
export class UpdateFrontCoverBookUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ bookId, file, userId }: IRequest): Promise<IBook> {
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

    if (book?.frontCover?.fileName) {
      await this.storageProvider.delete(
        book.frontCover.fileName,
        'books/images',
      )
    }

    const url = await this.storageProvider.upload(file, 'books/images')
    let frontCoverToUpdate: IAvatar

    if (book?.frontCover?.fileName) {
      const frontCover: IAvatar = {
        ...book.frontCover,
        fileName: file.filename,
        url,
        updatedAt: this.dateProvider.getDate(new Date()),
      }

      frontCoverToUpdate = frontCover
    } else {
      const frontCover = new Avatar({
        fileName: file.filename,
        url,
      })

      frontCoverToUpdate = frontCover
    }

    const updatedBook = await this.booksRepository.updateFrontCover({
      frontCover: frontCoverToUpdate,
      id: bookId,
    })

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} alterou a imagem do livro ${book.title} ${
        book.subtitle ? ' - ' + book.subtitle : ''
      }`,
      `${user.username} acabou de alterar a imagem do livro:  ${book.title} ${
        book.subtitle ? ' - ' + book.subtitle : ''
      } no projeto ${project.name}.`,
    )

    fs.rmSync(file.path)
    return updatedBook
  }
}
