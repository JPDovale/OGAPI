import { inject, injectable } from 'tsyringe'

import { IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'
import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  bookId: string
  words?: string
  title?: string
  subtitle?: string
  isbn?: string
  literaryGenere?: string
}

@injectable()
export class UpdateBookUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    userId,
    bookId,
    words,
    isbn,
    literaryGenere,
    title,
    subtitle,
  }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) {
      throw new AppError({
        title: 'O livro não existe',
        message: 'Parece que esse livro não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    const bookInfosUpdated: IUpdateBookDTO = {
      title: title || book.title,
      subtitle,
      words: words || book.words,
      literaryGenere: literaryGenere || book.literaryGenere,
      isbn,
    }

    const updatedBook = await this.booksRepository.updateBook({
      id: book.id,
      updatedInfos: bookInfosUpdated,
    })

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} acabou de alterar o livro: ${book.title}`,
      `${user.username} acabou de alterar o livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      } para ver mais informações.`,
    )

    return updatedBook
  }
}
