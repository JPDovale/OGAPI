import { inject, injectable } from 'tsyringe'

import { IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBook } from '@modules/books/infra/repositories/entities/IBook'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { KeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
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

    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async execute({ bookId, userId }: IRequest): Promise<IResponse> {
    let Book: IBook | null

    const bookExistesInCache = await this.cacheProvider.getInfo<IResponse>(
      KeysRedis.book + bookId,
    )

    if (!bookExistesInCache) {
      const book = await this.booksRepository.findById(bookId)
      if (!book) throw makeErrorBookNotFound()

      await this.cacheProvider.setInfo<IResponse>(
        KeysRedis.book + bookId,
        {
          book,
        },
        60 * 60, // 1 hour
      )

      Book = book
    } else {
      Book = bookExistesInCache.book
    }

    await this.verifyPermissions.verify({
      projectId: Book.project_id,
      userId,
      verifyPermissionTo: 'view',
    })

    return {
      book: Book,
    }
  }
}
