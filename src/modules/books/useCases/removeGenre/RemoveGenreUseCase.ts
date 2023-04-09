import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type IGenereBook } from '@modules/books/infra/mongoose/entities/types/IGenereBook'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookMinGenresExpected } from '@shared/errors/books/makeErrorBookMinGenresExpected'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'

interface IRequest {
  userId: string
  bookId: string
  genre: string
}

@injectable()
export class RemoveGenreUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ userId, bookId, genre }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) throw makeErrorBookNotFound()

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    if (book.generes.length <= 1) throw makeErrorBookMinGenresExpected()

    const updatedGenres: IGenereBook[] = book.generes.filter(
      (genere) => genere.name !== genre,
    )
    const updatedBook = await this.booksRepository.updateGenres({
      id: book.id,
      genres: updatedGenres,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} removeu um gênero ao livro: ${book.title}`,
      `${user.username} acabou de remover um gênero no livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      }' para ver mais informações.`,
    )

    return updatedBook
  }
}
