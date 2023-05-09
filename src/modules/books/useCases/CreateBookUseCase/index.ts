import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBook } from '@modules/books/infra/repositories/entities/IBook'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotCreated } from '@shared/errors/books/makeErrorBookNotCreated'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'

interface IRequest {
  userId: string
  projectId: string
  title: string
  subtitle?: string
  authors: Array<{
    user_id: string
  }>
  literaryGenre: string
  isbn?: string
  words?: number
  writtenWords?: number
}

interface IResponse {
  book: IBook
}

@injectable()
export class CreateBookUseCase {
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
    projectId,
    title,
    subtitle,
    authors,
    literaryGenre,
    isbn,
    words,
    writtenWords,
  }: IRequest): Promise<IResponse> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'edit',
    })

    const numbersOfBooksInProject = project._count?.books ?? 0

    if (numbersOfBooksInProject >= 3 && !user.last_payment_date && !user.admin)
      throw makeErrorLimitFreeInEnd()

    const newBook = await this.booksRepository.create({
      literary_genre: literaryGenre,
      project_id: project.id,
      title,
      user_id: user.id,
      authors: {
        createMany: {
          data: authors ?? [],
        },
      },
      subtitle,
      isbn,
      words,
      written_words: writtenWords,
    })

    if (!newBook) throw makeErrorBookNotCreated()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} criou o livro: ${newBook.title}`,
      content: `${user.username} acabou de criar o livro ${newBook.title}${
        newBook.subtitle ? ` ${newBook.subtitle}` : ''
      } no projeto: ${
        project.name
      }. Acesse a aba 'Livros' para ver mais informações.`,
    })

    return { book: newBook }
  }
}
