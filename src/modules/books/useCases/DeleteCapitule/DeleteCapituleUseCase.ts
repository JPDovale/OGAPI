import { inject, injectable } from 'tsyringe'

import { IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  bookId: string
  capituleId: string
  userId: string
}

@injectable()
export class DeleteCapituleUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({ bookId, capituleId, userId }: IRequest): Promise<IBook> {
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

    const capituleToDelete = book.capitules.find(
      (capitule) => capitule.id === capituleId,
    )
    const filteredCapitules = book.capitules.filter(
      (capitule) => capitule.id !== capituleId,
    )

    if (!capituleToDelete) {
      throw new AppError({
        title: 'O capitulo não existe',
        message: 'Parece que esse capitulo não existe na nossa base de dados',
        statusCode: 404,
      })
    }

    const capituleToDeleteSequence = Number(capituleToDelete.sequence)
    const wordsToDeleteInBook = Number(capituleToDelete.words || '0')
    const numberOfWrittenWordsOnBook = Number(book.writtenWords)
    const newNumberOfWrittenWordsOnBook = `${
      numberOfWrittenWordsOnBook - wordsToDeleteInBook
    }`

    const updatedCapitules = filteredCapitules.map((capitule) => {
      const capituleSequence = Number(capitule.sequence)

      if (capituleSequence < capituleToDeleteSequence) return capitule

      const updateCapitule: ICapitule = {
        ...capitule,
        sequence: `${capituleSequence - 1}`,
      }

      return updateCapitule
    })

    const updatedBook = await this.booksRepository.updateCapitules({
      capitules: updatedCapitules,
      id: bookId,
      writtenWords: newNumberOfWrittenWordsOnBook,
    })

    return updatedBook
  }
}
