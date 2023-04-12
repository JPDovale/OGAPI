import { type ICreateBookDTO } from '@modules/books/dtos/ICreateBookDTO'
import { type ICreateGenreDTO } from '@modules/books/dtos/ICreateGenreDTO'
import { type IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'
import { type IUpdateFrontCoverDTO } from '@modules/books/dtos/IUpdateFrontCoverDTO'

import { type IBooksRepository } from '../contracts/IBooksRepository'
import { type IBook } from '../entities/IBook'
import { type ICapitule } from '../entities/ICapitule'
import { type IGenre } from '../entities/IGenre'

export class BooksRepositoryInMemory implements IBooksRepository {
  books: IBook[] = []

  async create(data: ICreateBookDTO): Promise<IBook | null> {
    throw new Error('Method not implemented.')
  }

  async createGenre(data: ICreateGenreDTO): Promise<IGenre | null> {
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
    throw new Error('Method not implemented.')
  }
}
