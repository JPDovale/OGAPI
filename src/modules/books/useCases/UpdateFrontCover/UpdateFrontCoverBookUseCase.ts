import fs from 'fs'
import { inject, injectable } from 'tsyringe'

import {
  Avatar,
  type IAvatar,
} from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorFileNotUploaded } from '@shared/errors/useFull/makeErrorFileNotUploaded'

interface IRequest {
  userId: string
  bookId: string
  file: Express.Multer.File | undefined
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

    if (!book) throw makeErrorBookNotFound()
    if (!file) throw makeErrorFileNotUploaded()

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

    if (!updatedBook) throw makeErrorBookNotUpdate()

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
