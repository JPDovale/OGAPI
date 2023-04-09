import { inject, injectable } from 'tsyringe'

import { type IBook } from '@modules/books/infra/mongoose/entities/types/IBook'
import { type ICapitule } from '@modules/books/infra/mongoose/entities/types/ICapitule'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorReorderValues } from '@shared/errors/books/makeErrorReorderValues'

interface IRequest {
  userId: string
  bookId: string
  sequenceFrom: string
  sequenceTo: string
}

@injectable()
export class ReorderCapitulesUseCase {
  constructor(
    @inject('BooksRepository')
    private readonly booksRepository: IBooksRepository,
    @inject('VerifyPermissions')
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({
    bookId,
    userId,
    sequenceFrom,
    sequenceTo,
  }: IRequest): Promise<IBook> {
    const book = await this.booksRepository.findById(bookId)

    if (!book) throw makeErrorBookNotFound()

    await this.verifyPermissions.verify({
      projectId: book.defaultProject,
      userId,
      verifyPermissionTo: 'edit',
    })

    const sequenceFromInNumber = Number(sequenceFrom)
    const indexOfCapituleFrom = book.capitules.findIndex(
      (capitule) => capitule.sequence === sequenceFrom,
    )
    const sequenceToInNumber = Number(sequenceTo)
    const indexOfCapituleTo = book.capitules.findIndex(
      (capitule) => capitule.sequence === sequenceTo,
    )
    const capitulesSequenceLength = book.capitules.length

    const isInvalidSequenceTo =
      sequenceToInNumber > capitulesSequenceLength ||
      sequenceFromInNumber > capitulesSequenceLength ||
      sequenceFromInNumber <= 0 ||
      sequenceToInNumber <= 0

    if (isInvalidSequenceTo) throw makeErrorReorderValues()

    let capitulesReordered: ICapitule[] = []

    if (sequenceFromInNumber < sequenceToInNumber) {
      const preScenesOfSequenceFrom = book.capitules.slice(
        0,
        indexOfCapituleFrom,
      )
      const middleScenes = book.capitules.slice(
        indexOfCapituleFrom + 1,
        indexOfCapituleTo + 1,
      )
      const posScenesOfSequenceTo = book.capitules.slice(
        indexOfCapituleTo + 1,
        capitulesSequenceLength,
      )

      capitulesReordered = [
        ...preScenesOfSequenceFrom,
        ...middleScenes,
        book.capitules[indexOfCapituleFrom],
        ...posScenesOfSequenceTo,
      ]
    } else {
      const preScenesOfSequenceFrom = book.capitules.slice(0, indexOfCapituleTo)
      const middleScenes = book.capitules.slice(
        indexOfCapituleTo,
        indexOfCapituleFrom,
      )
      const posScenesOfSequenceTo = book.capitules.slice(
        indexOfCapituleFrom + 1,
        capitulesSequenceLength,
      )

      capitulesReordered = [
        ...preScenesOfSequenceFrom,
        book.capitules[indexOfCapituleFrom],
        ...middleScenes,
        ...posScenesOfSequenceTo,
      ]
    }

    capitulesReordered = capitulesReordered.map((capitule, i) => {
      const capituleFinal: ICapitule = {
        ...capitule,
        sequence: `${i + 1}`,
      }

      return capituleFinal
    })

    const updatedBook = await this.booksRepository.updateCapitules({
      id: book.id,
      capitules: capitulesReordered,
      writtenWords: book.writtenWords,
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    return updatedBook
  }
}
