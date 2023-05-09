import { type IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'
import { type IUpdateFrontCoverDTO } from '@modules/books/dtos/IUpdateFrontCoverDTO'
import { type IBooksRepository } from '@modules/books/infra/repositories/contracts/IBooksRepository'
import { type IBook } from '@modules/books/infra/repositories/entities/IBook'
import { type ICapitule } from '@modules/books/infra/repositories/entities/ICapitule'
import { type IGenre } from '@modules/books/infra/repositories/entities/IGenre'
import { type Prisma } from '@prisma/client'

import { BookMongo } from '../../entities/schemas/Book'

export class BooksMongoRepository implements IBooksRepository {
  async create(data: Prisma.BookUncheckedCreateInput): Promise<IBook | null> {
    throw new Error('Method not implemented.')
  }

  async createGenre(
    data: Prisma.GenreUncheckedCreateInput,
  ): Promise<IGenre | null> {
    throw new Error('Method not implemented.')
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async update(data: IUpdateBookDTO): Promise<IBook | null> {
    throw new Error('Method not implemented.')
  }

  async updateFrontCover(data: IUpdateFrontCoverDTO): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async removeGenreOfBook(genreId: string, bookId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async listCapitules(bookId: string): Promise<ICapitule[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<IBook | null> {
    throw new Error('Method not implemented.')
  }

  async listAll(): Promise<IBook[]> {
    const allBooks = await BookMongo.find()

    return allBooks as unknown as IBook[]
  }
}
