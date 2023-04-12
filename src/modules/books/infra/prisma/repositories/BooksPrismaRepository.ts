import { type IUpdateBookDTO } from '@modules/books/dtos/IUpdateBookDTO'
import { type IUpdateFrontCoverDTO } from '@modules/books/dtos/IUpdateFrontCoverDTO'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IBooksRepository } from '../../repositories/contracts/IBooksRepository'
import { type IBook } from '../../repositories/entities/IBook'
import { type ICapitule } from '../../repositories/entities/ICapitule'
import { type IGenre } from '../../repositories/entities/IGenre'

const defaultInclude: Prisma.BookInclude = {
  genres: true,
  authors: true,
  capitules: {
    include: {
      scenes: {
        include: {
          persons: true,
        },
      },
    },
  },
  comments: true,
}

export class BooksPrismaRepository implements IBooksRepository {
  async create(data: Prisma.BookUncheckedCreateInput): Promise<IBook | null> {
    const book = await prisma.book.create({
      data,
      include: defaultInclude,
    })

    return book
  }

  async createGenre(
    data: Prisma.GenreUncheckedCreateInput,
  ): Promise<IGenre | null> {
    const genre = await prisma.genre.create({
      data,
    })

    return genre
  }

  async findById(id: string): Promise<IBook | null> {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
      include: defaultInclude,
    })

    return book
  }

  async delete(id: string): Promise<void> {
    await prisma.book.delete({
      where: {
        id,
      },
    })
  }

  async update({ bookId, data }: IUpdateBookDTO): Promise<IBook | null> {
    const book = await prisma.book.update({
      where: {
        id: bookId,
      },
      data,
      include: defaultInclude,
    })

    return book
  }

  async updateFrontCover({
    bookId,
    front_cover_filename,
    front_cover_url,
  }: IUpdateFrontCoverDTO): Promise<void> {
    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        front_cover_filename,
        front_cover_url,
      },
    })
  }

  async removeGenreOfBook(genreId: string, bookId: string): Promise<void> {
    await prisma.genre.update({
      where: {
        id: genreId,
      },
      data: {
        books: {
          delete: {
            id: bookId,
          },
        },
      },
    })
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
