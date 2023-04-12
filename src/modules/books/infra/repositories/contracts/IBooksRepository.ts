import { type ICreateBookDTO } from '@modules/books/dtos/ICreateBookDTO'
import { type ICreateGenreDTO } from '@modules/books/dtos/ICreateGenreDTO'
import { type IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'
import { type IUpdateFrontCoverDTO } from '@modules/books/dtos/IUpdateFrontCoverDTO'

import { type IBook } from '../entities/IBook'
import { type ICapitule } from '../entities/ICapitule'
import { type IGenre } from '../entities/IGenre'

export abstract class IBooksRepository {
  abstract create(data: ICreateBookDTO): Promise<IBook | null>
  abstract createGenre(data: ICreateGenreDTO): Promise<IGenre | null>
  abstract delete(id: string): Promise<void>
  abstract update(data: IUpdateBookDTO): Promise<IBook | null>
  abstract updateFrontCover(data: IUpdateFrontCoverDTO): Promise<void>
  abstract removeGenreOfBook(genreId: string, bookId: string): Promise<void>
  abstract listCapitules(bookId: string): Promise<ICapitule[]>
  abstract findById(id: string): Promise<IBook | null>

  abstract listAll(): Promise<IBook[]>
}
