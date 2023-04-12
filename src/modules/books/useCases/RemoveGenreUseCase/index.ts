import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'

interface IRequest {
  userId: string
  bookId: string
  genreId: string
}

@injectable()
export class RemoveGenreUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ userId, bookId, genreId }: IRequest): Promise<void> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })
    await this.booksRepository.removeGenreOfBook(genreId, bookId)

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      title: `${user.username} removeu um gênero ao livro: ${book.title}`,
      content: `${user.username} acabou de remover um gênero no livro ${
        book.title
      }${book.subtitle ? ` ${book.subtitle}` : ''} dentro do projeto: ${
        project.name
      }. Acesse a aba 'Livros -> ${book.title}' para ver mais informações.`,
    })
  }
}
