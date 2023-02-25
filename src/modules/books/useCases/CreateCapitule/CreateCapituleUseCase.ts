import { inject, injectable } from 'tsyringe'

import { Capitule } from '@modules/books/infra/mongoose/entities/schemas/Capitule'
import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { IStructurePlotBook } from '@modules/books/infra/mongoose/entities/types/IPlotBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  bookId: string
  userId: string
  name: string
  objective: string
  structure?: IStructurePlotBook
}

@injectable()
export class CreateCapituleUseCase {
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
    bookId,
    name,
    objective,
    structure,
    userId,
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

    const newCapitule = new Capitule({
      complete: false,
      name,
      objective,
      structure,
      sequence: `${book.capitules.length + 1}`,
      createdAt: this.dateProvider.getDate(new Date()),
      updatedAt: this.dateProvider.getDate(new Date()),
    })

    const updatedCapitules = [...book.capitules, newCapitule]
    const updatedBook = await this.booksRepository.updateCapitules({
      capitules: updatedCapitules,
      id: bookId,
    })

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} criou um novo capitulo: ${newCapitule.name}`,
      `${user.username} acabou de criar um novo capitulo no livro ${
        book.title
      }${book.subtitle ? ` ${book.subtitle}` : ''} chamado ${
        newCapitule.name
      } dentro do projeto: ${project.name}. Acesse a aba 'Livros -> ${
        book.title
      } -> capítulos' para ver mais informações.`,
    )

    return updatedBook
  }
}
