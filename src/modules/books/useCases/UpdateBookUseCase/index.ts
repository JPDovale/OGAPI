import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBook } from '@modules/books/infra/repositories/entities/IBook'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'

interface IRequest {
  userId: string
  bookId: string
  words?: number
  title?: string
  subtitle?: string
  isbn?: string
  literaryGenere?: string
}

interface IResponse {
  book: IBook
}

@injectable()
export class UpdateBookUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
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
  }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const updatedBook = await this.booksRepository.update({
      bookId,
      data: {
        words,
        isbn,
        literary_genre: literaryGenere,
        title,
        subtitle,
      },
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} acabou de alterar o livro: ${book.title}`,
      content: `${user.username} acabou de alterar o livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      } para ver mais informações.`,
    })

    return { book: updatedBook }
  }
}
