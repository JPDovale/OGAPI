import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

import { BookMongo } from '../../entities/schemas/Book'
import { PlotBook } from '../../entities/schemas/PlotBook'
import { IBook } from '../../entities/types/IBook'
import { IBooksRepository } from '../IBooksRepository'
import { ICreateBook } from '../types/ICreateBook'
import { IFindManyById } from '../types/IFindManyById'
import { IUpdateCapitules } from '../types/IUpdateCapitules'
import { IUpdateFrontCover } from '../types/IUpdateFrontCover'

@injectable()
export class BooksMongoRepository implements IBooksRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create({
    projectId,
    book: {
      authors,
      generes,
      createdPerUser,
      literaryGenere,
      title,
      isbn,
      subtitle,
      words,
      writtenWords,
    },
  }: ICreateBook): Promise<IBook> {
    const newBook = new BookMongo({
      id: uuidV4(),
      title,
      subtitle,
      createdPerUser,
      authors,
      defaultProject: projectId,
      generes,
      literaryGenere,
      isbn,
      words,
      writtenWords,
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

  async findById(id: string): Promise<IBook> {
    const book = await BookMongo.findOne({ id })
    return book
  }

  async updateFrontCover({
    id,
    frontCover,
  }: IUpdateFrontCover): Promise<IBook> {
    await BookMongo.updateOne(
      { id },
      { frontCover, updateAt: this.dateProvider.getDate(new Date()) },
    )

    const book = await BookMongo.findOne({ id })
    return book
  }

  async updateCapitules({
    id,
    capitules,
    writtenWords,
  }: IUpdateCapitules): Promise<IBook> {
    if (writtenWords) {
      await BookMongo.updateOne(
        { id },
        {
          capitules,
          writtenWords,
          updateAt: this.dateProvider.getDate(new Date()),
        },
      )
      const book = await BookMongo.findOne({ id })
      return book
    } else {
      await BookMongo.updateOne(
        { id },
        { capitules, updateAt: this.dateProvider.getDate(new Date()) },
      )

      const book = await BookMongo.findOne({ id })
      return book
    }
  }

  async deletePerUserId(id: string): Promise<void> {
    await BookMongo.deleteMany({ createdPerUser: id })
  }

  async listPerUser(userId: string): Promise<IBook[]> {
    const books = await BookMongo.find({ createdPerUser: userId })

    return books
  }

  async deletePerProjectId(projectId: string): Promise<void> {
    await BookMongo.deleteMany({ defaultProject: projectId })
  }

  async findByProjectIds(projectIds: string[]): Promise<IBook[]> {
    const projectsIds = projectIds.map((id) => {
      return {
        defaultProject: id,
      }
    })

    const books = await BookMongo.find({ $or: projectsIds })

    return books
  }
}
