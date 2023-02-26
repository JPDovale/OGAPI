import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IGenereBook } from '@modules/books/infra/mongoose/entities/types/IGenereBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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

    if (book.generes.length <= 1) {
      throw new AppError({
        title: 'O livre precisa ter pelo menos um gênero',
        message:
          'O livre precisa ter pelo menos um gênero para um controle maior da objetividade da sua escrita',
        statusCode: 400,
      })
    }

    const updatedGenres: IGenereBook[] = book.generes.filter(
      (genere) => genere.name !== genre,
    )
    const updatedBook = await this.booksRepository.updateGenres({
      id: book.id,
      genres: updatedGenres,
    })

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
