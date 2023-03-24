import { inject, injectable } from 'tsyringe'

import { Scene } from '@modules/books/infra/mongoose/entities/schemas/Scene'
import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { type IStructurePlotBook } from '@modules/books/infra/mongoose/entities/types/IPlotBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'

interface IRequest {
  userId: string
  bookId: string
  capituleId: string
  objective: string
  structure: IStructurePlotBook
  persons: string[]
}

@injectable()
export class CreateSceneUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({
    userId,
    bookId,
    capituleId,
    objective,
    structure,
    persons,
  }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) throw makeErrorBookNotFound()

    const { project, user } = await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    const capituleToUpdate = book.capitules.find(
      (capitule) => capitule.id === capituleId,
    )
    const indexOfCapituleToUpdate = book.capitules.findIndex(
      (capitule) => capitule.id === capituleId,
    )

    if (!capituleToUpdate || indexOfCapituleToUpdate < 0)
      throw makeErrorCapituleNotFound()

    const newScene = new Scene({
      complete: false,
      objective,
      persons,
      sequence: `${capituleToUpdate.scenes.length + 1}`,
      structure,
    })

    const capitule: ICapitule = {
      ...capituleToUpdate,
      complete: false,
      scenes: [...capituleToUpdate.scenes, { ...newScene }],
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = capitule

    const updatedBook = await this.booksRepository.updateCapitules({
      capitules,
      id: bookId,
      writtenWords: book.writtenWords,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} criou uma nova cena no capitulo: ${capitule.name}`,
      `${user.username} acabou de criar uma nova cena no capitulo ${
        capitule.name
      } no livro ${book.title}${
        book.subtitle ? ` ${book.subtitle}` : ''
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      } -> capítulos -> ${capitule.name} -> cenas' para ver mais informações.`,
    )

    return updatedBook
  }
}
