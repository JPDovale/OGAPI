import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'

interface IRequest {
  bookId: string
  userId: string
  name: string
  objective: string
  structure?: {
    act1?: string
    act2?: string
    act3?: string
  }
}

interface IResponse {
  capitule: ICapitule
}

@injectable()
export class CreateCapituleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,
  ) {}

  async execute({
    bookId,
    name,
    objective,
    structure,
    userId,
  }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const numberOfCapitules = book.capitules?.length ?? 0

    const capitule = await this.capitulesRepository.create({
      book_id: book.id,
      name,
      objective,
      sequence: numberOfCapitules + 1,
      structure_act_1: structure?.act1,
      structure_act_2: structure?.act2,
      structure_act_3: structure?.act3,
    })

    if (!capitule) throw makeErrorBookNotUpdate()

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} criou um novo capitulo: ${capitule.name}`,
      content: `${user.username} acabou de criar um novo capitulo no livro ${
        book.title
      }${book.subtitle ? ` ${book.subtitle}` : ''} chamado ${
        capitule.name
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      } -> capítulos' para ver mais informações.`,
    })

    return { capitule }
  }
}
