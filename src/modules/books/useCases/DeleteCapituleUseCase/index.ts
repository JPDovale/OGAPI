import { inject, injectable } from 'tsyringe'

import { type IUpdateManyCapitulesDTO } from '@modules/books/dtos/IUpdateManyCapitulesDTO'
import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { ICapitulesRepository } from '@modules/books/infra/repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { makeErrorBookNotUpdate } from '@shared/errors/books/makeErrorBookNotUpdate'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'

interface IRequest {
  bookId: string
  capituleId: string
  userId: string
}

interface IResponse {
  capitules: ICapitule[]
  writtenWords: number
}

@injectable()
export class DeleteCapituleUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CapitulesRepository)
    private readonly capitulesRepository: ICapitulesRepository,
  ) {}

  async execute({ bookId, capituleId, userId }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'edit',
    })

    const filteredCapitules =
      book.capitules?.filter((capitule) => capitule.id !== capituleId) ?? []

    const capituleToDelete = await this.capitulesRepository.findById(capituleId)
    if (!capituleToDelete) throw makeErrorCapituleNotFound()

    const writtenWordsInBook = book.written_words - capituleToDelete.words

    const updatedCapitules: IUpdateManyCapitulesDTO = filteredCapitules?.map(
      (capitule) => {
        if (capitule.sequence < capituleToDelete.sequence) {
          return null
        }

        return {
          capituleId: capitule.id,
          data: {
            sequence: capitule.sequence - 1,
          },
        }
      },
    )

    await this.capitulesRepository.updateMany(updatedCapitules)

    const updatedBook = await this.booksRepository.update({
      bookId,
      data: {
        written_words: writtenWordsInBook,
      },
    })

    if (!updatedBook) throw makeErrorBookNotUpdate()

    await this.capitulesRepository.delete(capituleId)

    return {
      capitules: book.capitules ?? [],
      writtenWords: updatedBook.written_words,
    }
  }
}
