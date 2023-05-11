import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBook } from '@modules/books/infra/repositories/entities/IBook'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'

interface IRequest {
  userId: string
  bookId: string
}

interface IResponse {
  book: IBook
}

@injectable()
export class GetBookUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.BooksRepository)
    private readonly booksRepository: IBooksRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,
  ) {}

  async execute({ bookId, userId }: IRequest): Promise<IResponse> {
    const book = await this.booksRepository.findById(bookId)
    if (!book) throw makeErrorBookNotFound()

    await this.verifyPermissions.verify({
      projectId: book.project_id,
      userId,
      verifyPermissionTo: 'view',
    })

    return {
      book,
    }
  }
}
