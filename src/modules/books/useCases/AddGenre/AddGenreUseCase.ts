import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type IGenereBook } from '@modules/books/infra/mongoose/entities/types/IGenereBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookGenreAlreadyExistes } from '@shared/errors/books/makeErrorBookGenreAlreadyExistes'
import { makeErrorBookMaxGenresAdded } from '@shared/errors/books/makeErrorBookMaxGenresAdded'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'

interface IRequest {
  userId: string
  bookId: string
  genre: string
}

@injectable()
export class AddGenreUseCase {
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

    if (book.generes.length >= 6) throw makeErrorBookMaxGenresAdded()

    const genreAlreadyExists = book.generes.find(
      (g) => g.name.toLowerCase() === genre.toLowerCase(),
    )
    if (genreAlreadyExists) throw makeErrorBookGenreAlreadyExistes()

    const genreToAdd: IGenereBook = {
      name: genre,
    }

    const updatedGenres: IGenereBook[] = [genreToAdd, ...book.generes]
    const updatedBook = await this.booksRepository.updateGenres({
      id: book.id,
      genres: updatedGenres,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} adicionou um gênero ao livro: ${book.title}`,
      `${user.username} acabou de adicionar um novo gênero no livro ${
        book.title
      }${book.subtitle ? ` ${book.subtitle}` : ''} dentro do projeto: ${
        project.name
      }. Acesse a aba 'Livros -> ${book.title}' para ver mais informações.`,
    )

    return updatedBook
  }
}
