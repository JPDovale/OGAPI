import { inject, injectable } from 'tsyringe'

import { Capitule } from '@modules/books/infra/mongoose/entities/schemas/Capitule'
import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IStructurePlotBook } from '@modules/books/infra/mongoose/entities/types/IPlotBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
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

    await this.verifyPermissions.verify({
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

    const updatedCapitules: ICapitule[] = [...book.capitules, newCapitule]
    const updatedBook = await this.booksRepository.updateCapitules({
      capitules: updatedCapitules,
      id: bookId,
    })

    return updatedBook
  }
}
