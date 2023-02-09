import { inject, injectable } from 'tsyringe'

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
  capituleId: string
  name?: string
  objective?: string
  structure?: IStructurePlotBook
}

@injectable()
export class UpdateCapituleUseCase {
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
    userId,
    capituleId,
    name,
    objective,
    structure,
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

    const capituleToUpdate = book.capitules.find(
      (capitule) => capitule.id === capituleId,
    )
    const indexOfCapituleToUpdate = book.capitules.findIndex(
      (capitule) => capitule.id === capituleId,
    )

    if (!capituleToUpdate || indexOfCapituleToUpdate < 0) {
      throw new AppError({
        title: 'O capítulo não existe',
        message: 'Parece que esse capítulo não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const capitule: ICapitule = {
      ...capituleToUpdate,
      name: name || capituleToUpdate.name,
      objective: objective || capituleToUpdate.objective,
      structure: {
        act1: structure.act1 ? structure.act1 : capituleToUpdate.structure.act1,
        act2: structure.act2 ? structure.act2 : capituleToUpdate.structure.act2,
        act3: structure.act3 ? structure.act3 : capituleToUpdate.structure.act3,
      },
      updatedAt: this.dateProvider.getDate(new Date()),
    }

    const capitules = book.capitules
    capitules[indexOfCapituleToUpdate] = capitule

    const updatedBook = await this.booksRepository.updateCapitules({
      capitules,
      id: bookId,
    })

    return updatedBook
  }
}
