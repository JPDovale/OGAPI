import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IBooksRepository } from '@modules/books/infra/mongoose/repositories/IBooksRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'

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

    if (!book) throw makeErrorBookNotFound()

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

    if (!capituleToDelete) throw makeErrorCapituleNotFound()

    const capituleToDeleteSequence = Number(capituleToDelete.sequence)
    const wordsToDeleteInBook = Number(capituleToDelete.words ?? '0')
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

    if (!updatedBook) throw makeErrorBookNotUpdate()

    return updatedBook
  }
}
