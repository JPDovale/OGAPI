import { inject, injectable } from 'tsyringe'

import { type IUpdateCapituleDTO } from '@modules/books/dtos/IUpdateCapituleDTO'
import { type IUpdateManyCapitulesDTO } from '@modules/books/dtos/IUpdateManyCapitulesDTO'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorReorderValues } from '@shared/errors/books/makeErrorReorderValues'

interface IRequest {
  userId: string
  bookId: string
  sequenceFrom: number
  sequenceTo: number
}

interface IResponse {
  capitules: ICapitule[]
}

@injectable()
export class ReorderCapitulesUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,
  ) {}

  async execute({
    bookId,
    userId,
    sequenceFrom,
    sequenceTo,
  }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()
    if (!book.capitules) throw makeErrorReorderValues()

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const indexOfCapituleFrom = book.capitules?.findIndex(
      (capitule) => capitule.sequence === sequenceFrom,
    )
    const indexOfCapituleTo = book.capitules?.findIndex(
      (capitule) => capitule.sequence === sequenceTo,
    )
    const capitulesSequenceLength = book.capitules?.length

    const isInvalidSequenceTo =
      sequenceTo > capitulesSequenceLength ||
      sequenceFrom > capitulesSequenceLength ||
      sequenceFrom <= 0 ||
      sequenceTo <= 0

    if (isInvalidSequenceTo) throw makeErrorReorderValues()

    let capitulesReordered: ICapitule[] = []

    if (sequenceFrom < sequenceTo) {
      const preCapitulesOfSequenceFrom = book.capitules?.slice(
        0,
        indexOfCapituleFrom,
      )
      const middleCapitules = book.capitules?.slice(
        indexOfCapituleFrom + 1,
        indexOfCapituleTo + 1,
      )
      const posCapitulesOfSequenceTo = book.capitules?.slice(
        indexOfCapituleTo + 1,
        capitulesSequenceLength,
      )

      capitulesReordered = [
        ...preCapitulesOfSequenceFrom,
        ...middleCapitules,
        book.capitules[indexOfCapituleFrom],
        ...posCapitulesOfSequenceTo,
      ]
    } else {
      const preCapitulesOfSequenceFrom = book.capitules.slice(
        0,
        indexOfCapituleTo,
      )
      const middleCapitules = book.capitules.slice(
        indexOfCapituleTo,
        indexOfCapituleFrom,
      )
      const posCapitulesOfSequenceTo = book.capitules.slice(
        indexOfCapituleFrom + 1,
        capitulesSequenceLength,
      )

      capitulesReordered = [
        ...preCapitulesOfSequenceFrom,
        book.capitules[indexOfCapituleFrom],
        ...middleCapitules,
        ...posCapitulesOfSequenceTo,
      ]
    }

    const updatedCapitules: IUpdateManyCapitulesDTO = capitulesReordered.map(
      (capitule, i) => {
        const updatedCapitule: IUpdateCapituleDTO = {
          capituleId: capitule.id,
          data: {
            sequence: i + 1,
          },
        }

        return updatedCapitule
      },
    )

    await this.capitulesRepository.updateMany(updatedCapitules)

    const capitules = await this.booksRepository.listCapitules(bookId)

    return { capitules }
  }
}
