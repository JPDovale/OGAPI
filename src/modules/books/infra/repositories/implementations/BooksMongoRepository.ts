import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'

import { BookMongo } from '../../entities/schemas/Book'
import { PlotBook } from '../../entities/schemas/PlotBook'
import { IBook } from '../../entities/types/IBook'
import { IBooksRepository } from '../IBooksRepository'
import { ICreateBook } from '../types/ICreateBook'
import { IFindManyById } from '../types/IFindManyById'

@injectable()
export class BooksMongoRepository implements IBooksRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create({
    projectId,
    book: { authors, generes, literaryGenere, title, isbn, subtitle },
  }: ICreateBook): Promise<IBook> {
    const newBook = new BookMongo({
      id: uuidV4(),
      title,
      subtitle,
      authors,
      defaultProject: projectId,
      generes,
      literaryGenere,
      isbn,
      plot: new PlotBook({}),
      createAt: this.dateProvider.getDate(new Date()),
      updateAt: this.dateProvider.getDate(new Date()),
    })

    await newBook.save()

    return newBook
  }

  async findManyById({ ids }: IFindManyById): Promise<IBook[]> {
    const booksIds = ids.map((id) => {
      return {
        id,
      }
    })

    const books = await BookMongo.find({ $or: booksIds })

    return books
  }
}
