import { inject, injectable } from 'tsyringe'

import { Scene } from '@modules/books/infra/mongoose/entities/schemas/Scene'
import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IStructurePlotBook } from '@modules/books/infra/mongoose/entities/types/IPlotBook'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

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
      scenes: [...capituleToUpdate.scenes, newScene],
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
