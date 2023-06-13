import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IGenre } from '@modules/books/infra/repositories/entities/IGenre'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookGenreAlreadyExistes } from '@shared/errors/books/makeErrorBookGenreAlreadyExistes'
import { makeErrorBookMaxGenresAdded } from '@shared/errors/books/makeErrorBookMaxGenresAdded'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  bookId: string
  genre: string
}

interface IResponse {
  genre: IGenre
}

@injectable()
export class AddGenreUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({
    userId,
    bookId,
    genre,
  }: IRequest): Promise<IResolve<IResponse>> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) {
      return {
        ok: false,
        error: makeErrorBookNotFound(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
      verifyFeatureInProject: ['books'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { project, user } = verification.data!

    const numberGenresInBook = book.genres?.length ?? 0
    if (numberGenresInBook >= 6) {
      return {
        ok: false,
        error: makeErrorBookMaxGenresAdded(),
      }
    }

    const genreAlreadyExists = book.genres?.find(
      (g) => g.name.toLowerCase().trim() === genre.toLowerCase().trim(),
    )
    if (genreAlreadyExists) {
      return {
        ok: false,
        error: makeErrorBookGenreAlreadyExistes(),
      }
    }

    const newGenre = await this.booksRepository.createGenre({
      name: genre,
      books: {
        connect: {
          id: book.id,
        },
      },
    })

    if (!newGenre) {
      return {
        ok: false,
        error: makeErrorBookNotUpdate(),
      }
    }

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} adicionou um gênero ao livro: ${book.title}`,
      content: `${user.username} acabou de adicionar um novo gênero no livro ${
        book.title
      }${book.subtitle ? ` ${book.subtitle}` : ''} dentro do projeto: ${
        project.name
      }. Acesse a aba 'Livros -> ${book.title}' para ver mais informações.`,
    })

    return {
      ok: true,
      data: {
        genre: newGenre,
      },
    }
  }
}
