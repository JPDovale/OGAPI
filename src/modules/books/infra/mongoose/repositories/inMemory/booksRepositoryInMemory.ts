import { v4 as uuidV4 } from 'uuid'

import { BookMongo } from '../../entities/schemas/Book'
import { PlotBook } from '../../entities/schemas/PlotBook'
import { type IBook } from '../../entities/types/IBook'
import { type IBooksRepository } from '../IBooksRepository'
import { type ICreateBook } from '../types/ICreateBook'
import { type IFindManyById } from '../types/IFindManyById'
import { type IUpdateBook } from '../types/IUpdateBook'
import { type IUpdateCapitules } from '../types/IUpdateCapitules'
import { type IUpdateFrontCover } from '../types/IUpdateFrontCover'
import { type IUpdateGenres } from '../types/IUpdateGenres'

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
      capitules,
    },
  }: ICreateBook): Promise<IBook | null | undefined> {
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
      capitules: capitules ?? [],
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

  async findById(id: string): Promise<IBook | null | undefined> {
    const book = this.books.find((book) => book.id === id)

    return book
  }

  updateFrontCover: ({
    id,
    frontCover,
  }: IUpdateFrontCover) => Promise<IBook | null | undefined>

  async updateCapitules({
    id,
    capitules,
    writtenWords,
  }: IUpdateCapitules): Promise<IBook | null | undefined> {
    const indexOfBookToUpdate = this.books.findIndex((book) => book.id === id)
    const book = this.books.find((book) => book.id === id)

    if (!book) return undefined

    const bookToUpdate = book.toObject()

    this.books[indexOfBookToUpdate] = {
      ...bookToUpdate,
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

  async updateGenres({
    genres,
    id,
  }: IUpdateGenres): Promise<IBook | null | undefined> {
    const indexOfBookToUpdate = this.books.findIndex((book) => book.id === id)
    const book = this.books[indexOfBookToUpdate]

    const bookToUpdate = book.toObject()

    this.books[indexOfBookToUpdate] = {
      ...bookToUpdate,
      generes: [...genres],
    }

    return this.books[indexOfBookToUpdate]
  }

  async updateBook({
    id,
    updatedInfos,
  }: IUpdateBook): Promise<IBook | null | undefined> {
    const indexOfBookToUpdate = this.books.findIndex((book) => book.id === id)
    const book = this.books[indexOfBookToUpdate]

    const bookToUpdate = book.toObject()

    this.books[indexOfBookToUpdate] = {
      ...bookToUpdate,
      ...updatedInfos,
    }

    return this.books[indexOfBookToUpdate]
  }

  async deletePerId(id: string): Promise<void> {
    const filteredBooks = this.books.filter((book) => book.id !== id)

    this.books = filteredBooks
  }
}
