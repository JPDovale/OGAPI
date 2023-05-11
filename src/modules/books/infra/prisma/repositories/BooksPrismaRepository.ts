import { inject, injectable } from 'tsyringe'

import { type IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorBookNotFound } from '@shared/errors/books/makeErrorBookNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IBooksRepository } from '../../repositories/contracts/IBooksRepository'
import { type IBook } from '../../repositories/entities/IBook'
import { type ICapitule } from '../../repositories/entities/ICapitule'
import { type IGenre } from '../../repositories/entities/IGenre'

export const defaultIncludeBook: Prisma.BookInclude = {
  genres: true,
  authors: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          avatar_url: true,
          username: true,
          email: true,
        },
      },
    },
  },
  capitules: {
    select: {
      id: true,
      name: true,
      complete: true,
      sequence: true,
      words: true,
      objective: true,
      structure_act_1: true,
      structure_act_2: true,
      structure_act_3: true,
      _count: {
        select: {
          scenes: true,
        },
      },
    },
    orderBy: {
      sequence: 'asc',
    },
  },
  comments: true,
}

@injectable()
export class BooksPrismaRepository implements IBooksRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async setBookInCache(book: IBook): Promise<void> {
    await this.cacheProvider.setInfo<IBook>(
      {
        key: 'book',
        objectId: book.id,
      },
      book,
      60 * 60 * 24, // 1 day
    )
  }

  private async getBookInCache(bookId: string): Promise<IBook | null> {
    return await this.cacheProvider.getInfo<IBook>({
      key: 'book',
      objectId: bookId,
    })
  }

  async create(data: Prisma.BookUncheckedCreateInput): Promise<IBook | null> {
    const book = await prisma.book.create({
      data,
      include: defaultIncludeBook,
    })

    if (book) {
      Promise.all([
        this.setBookInCache(book),

        this.cacheProvider.delete({
          key: 'project',
          objectId: book.project_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return book
  }

  async createGenre(
    data: Prisma.GenreUncheckedCreateInput,
  ): Promise<IGenre | null> {
    const genre = await prisma.genre.create({
      data,
    })

    this.cacheProvider
      .delete({
        key: 'book',
        objectId: '*',
      })
      .catch((err) => {
        throw err
      })

    return genre
  }

  async findById(id: string): Promise<IBook | null> {
    const bookInCache = await this.getBookInCache(id)
    if (bookInCache) return bookInCache

    const book = await prisma.book.findUnique({
      where: {
        id,
      },
      include: defaultIncludeBook,
    })

    if (book) {
      this.setBookInCache(book).catch((err) => {
        throw err
      })
    }

    return book
  }

  async delete(id: string): Promise<void> {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
      select: {
        project_id: true,
        capitules: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!book) throw makeErrorBookNotFound()

    const promises = [
      prisma.book.delete({
        where: {
          id,
        },
      }),
      this.cacheProvider.delete({
        key: 'project',
        objectId: book.project_id,
      }),
      this.cacheProvider.delete({
        key: 'book',
        objectId: id,
      }),
    ]

    book.capitules.map((capitule) =>
      promises.push(
        this.cacheProvider.delete({ key: 'capitule', objectId: capitule.id }),
      ),
    )

    await Promise.all(promises)
  }

  async update({ bookId, data }: IUpdateBookDTO): Promise<IBook | null> {
    const book = await prisma.book.update({
      where: {
        id: bookId,
      },
      data,
      include: defaultIncludeBook,
    })

    if (book) {
      Promise.all([
        this.setBookInCache(book),

        this.cacheProvider.delete({
          key: 'project',
          objectId: book.project_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return book
  }

  async removeGenreOfBook(genreId: string, bookId: string): Promise<void> {
    await Promise.all([
      prisma.genre.update({
        where: {
          id: genreId,
        },
        data: {
          books: {
            disconnect: {
              id: bookId,
            },
          },
        },
      }),

      this.cacheProvider.delete({ key: 'book', objectId: bookId }),
    ])
  }

  async listCapitules(bookId: string): Promise<ICapitule[]> {
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        capitules: {
          include: {
            scenes: {
              include: {
                persons: true,
              },
            },
          },
        },
      },
    })

    return book?.capitules ?? []
  }

  async listAll(): Promise<IBook[]> {
    throw new Error('Method not implemented.')
  }
}
