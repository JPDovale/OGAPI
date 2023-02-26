import { v4 as uuidV4 } from 'uuid'

import { BookMongo } from '../../entities/schemas/Book'
import { PlotBook } from '../../entities/schemas/PlotBook'
import { IBook } from '../../entities/types/IBook'
import { IBooksRepository } from '../IBooksRepository'
import { ICreateBook } from '../types/ICreateBook'
import { IFindManyById } from '../types/IFindManyById'
import { IUpdateCapitules } from '../types/IUpdateCapitules'
import { IUpdateFrontCover } from '../types/IUpdateFrontCover'
import { IUpdateGenres } from '../types/IUpdateGenres'

export class BooksRepositoryInMemory implements IBooksRepository {
  books: IBook[] = []

  async create({
    projectId,
    book: {
      authors,
      generes,
      literaryGenere,
      title,
      isbn,
      subtitle,
      words,
      writtenWords,
      createdPerUser,
    },
  }: ICreateBook): Promise<IBook> {
    const newBook = new BookMongo({
      id: uuidV4(),
      title,
      subtitle,
      authors,
      createdPerUser,
      defaultProject: projectId,
      generes,
      literaryGenere,
      isbn,
      words,
      writtenWords,
      plot: new PlotBook({}),
      createAt: new Date(),
      updateAt: new Date(),
    })

    this.books.push(newBook)

    return newBook
  }

  async findManyById({ ids }: IFindManyById): Promise<IBook[]> {
    const books = this.books.filter((book) => {
      const bookIn = ids.find((id) => id === book.id)

      return !!bookIn
    })

    return books
  }

  async findById(id: string): Promise<IBook> {
    const book = this.books.find((book) => book.id === id)

    return book
  }

  updateFrontCover: ({ id, frontCover }: IUpdateFrontCover) => Promise<IBook>

  async updateCapitules({
    id,
    capitules,
    writtenWords,
  }: IUpdateCapitules): Promise<IBook> {
    const indexOfBookToUpdate = this.books.findIndex((book) => book.id === id)
    const bookToUpdate = this.books[indexOfBookToUpdate]

    this.books[indexOfBookToUpdate] = {
      ...bookToUpdate._doc,
      capitules: [...capitules],
      writtenWords,
    }

    return this.books[indexOfBookToUpdate]
  }

  async deletePerUserId(id: string): Promise<void> {
    const filteredBooks = this.books.filter(
      (book) => book.createdPerUser !== id,
    )

    this.books = filteredBooks
  }

  async listPerUser(userId: string): Promise<IBook[]> {
    const books = this.books.filter((book) => book.createdPerUser === userId)

    return books
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    const filteredBooks = this.books.filter(
      (book) => book.defaultProject !== projectId,
    )

    this.books = filteredBooks
  }

  async findByProjectIds(projectIds: string[]): Promise<IBook[]> {
    const books = this.books.filter((book) => {
      const bookIn = projectIds.find((id) => id === book.defaultProject)

      return !!bookIn
    })

    return books
  }

  async updateGenres({ genres, id }: IUpdateGenres): Promise<IBook> {
    const indexOfBookToUpdate = this.books.findIndex((book) => book.id === id)
    const bookToUpdate = this.books[indexOfBookToUpdate]

    this.books[indexOfBookToUpdate] = {
      ...bookToUpdate._doc,
      generes: [...genres],
    }

    return this.books[indexOfBookToUpdate]
  }
}
