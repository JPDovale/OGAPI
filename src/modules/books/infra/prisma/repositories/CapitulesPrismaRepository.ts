import { inject, injectable } from 'tsyringe'

import { type ICreateCapituleDTO } from '@modules/books/dtos/ICreateCapituleDTO'
import { type IUpdateCapituleDTO } from '@modules/books/dtos/IUpdateCapituleDTO'
import { type IUpdateManyCapitulesDTO } from '@modules/books/dtos/IUpdateManyCapitulesDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorCapituleNotFound } from '@shared/errors/books/makeErrorCapituleNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type ICapitulesRepository } from '../../repositories/contracts/ICapitulesRepository'
import { type ICapitule } from '../../repositories/entities/ICapitule'
import { type IScene } from '../../repositories/entities/IScene'

@injectable()
export class CapitulesPrismaRepository implements ICapitulesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async setCapituleInCache(capitule: ICapitule): Promise<void> {
    await this.cacheProvider.setInfo<ICapitule>(
      {
        key: 'capitule',
        objectId: capitule.id,
      },
      capitule,
      60 * 60 * 24, // 1 day
    )
  }

  private async getCapituleInCache(
    capituleId: string,
  ): Promise<ICapitule | null> {
    return await this.cacheProvider.getInfo<ICapitule>({
      key: 'capitule',
      objectId: capituleId,
    })
  }

  async create(data: ICreateCapituleDTO): Promise<ICapitule | null> {
    const capitule = await prisma.capitule.create({
      data,
      include: {
        scenes: {
          include: {
            persons: true,
          },
          orderBy: {
            sequence: 'asc',
          },
        },
        comments: {
          include: {
            responses: true,
          },
        },
        book: {
          select: {
            project_id: true,
          },
        },
      },
    })

    if (capitule) {
      Promise.all([
        this.setCapituleInCache(capitule),

        this.cacheProvider.delete({
          key: 'book',
          objectId: capitule.book_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return capitule
  }

  async findById(capituleId: string): Promise<ICapitule | null> {
    const capituleInCache = await this.getCapituleInCache(capituleId)
    if (capituleInCache) return capituleInCache

    const capitule = await prisma.capitule.findUnique({
      where: {
        id: capituleId,
      },
      include: {
        scenes: {
          include: {
            persons: true,
          },
          orderBy: {
            sequence: 'asc',
          },
        },
        comments: {
          include: {
            responses: true,
          },
        },
        book: {
          select: {
            project_id: true,
          },
        },
      },
    })

    if (capitule) {
      this.setCapituleInCache(capitule).catch((err) => {
        throw err
      })
    }

    return capitule
  }

  async delete(capituleId: string): Promise<void> {
    const capitule = await prisma.capitule.findUnique({
      where: {
        id: capituleId,
      },
      select: {
        book_id: true,
      },
    })
    if (!capitule) throw makeErrorCapituleNotFound()

    await Promise.all([
      this.cacheProvider.delete({
        key: 'capitule',
        objectId: capituleId,
      }),
      prisma.capitule.delete({
        where: {
          id: capituleId,
        },
      }),
    ])
  }

  async updateMany(data: IUpdateManyCapitulesDTO): Promise<void> {
    const factoryDataWithObjectsPossibleNull: Array<Prisma.CapituleUpdateArgs | null> =
      data.map((update) => {
        if (!update) return null

        return {
          where: {
            id: update.capituleId,
          },
          data: update.data,
          include: {
            scenes: {
              include: {
                persons: true,
              },
              orderBy: {
                sequence: 'asc',
              },
            },
            comments: {
              include: {
                responses: true,
              },
            },
            book: {
              select: {
                project_id: true,
              },
            },
          },
        }
      })

    const factoryData: Prisma.CapituleUpdateArgs[] =
      factoryDataWithObjectsPossibleNull.filter(
        (update): update is Prisma.CapituleUpdateArgs => update !== null,
      )

    const capitulesUpdated = await prisma.$transaction(
      factoryData.map((update) => prisma.capitule.update(update)),
    )

    const promises = [
      this.cacheProvider.delete({
        key: 'book',
        objectId: capitulesUpdated[0].book_id,
      }),
    ]

    capitulesUpdated.map((capitule) =>
      promises.push(this.setCapituleInCache(capitule)),
    )

    Promise.all(promises).catch((err) => {
      throw err
    })
  }

  async update({
    capituleId,
    data,
  }: IUpdateCapituleDTO): Promise<ICapitule | null> {
    const capitule = await prisma.capitule.update({
      where: {
        id: capituleId,
      },
      data,
      include: {
        scenes: {
          include: {
            persons: true,
          },
          orderBy: {
            sequence: 'asc',
          },
        },
        comments: {
          include: {
            responses: true,
          },
        },
        book: {
          select: {
            project_id: true,
          },
        },
      },
    })

    if (capitule) {
      Promise.all([
        this.setCapituleInCache(capitule),
        this.cacheProvider.delete({
          key: 'book',
          objectId: capitule.book_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return capitule
  }

  async listScenes(capituleId: string): Promise<IScene[]> {
    const capitule = await prisma.capitule.findUnique({
      where: {
        id: capituleId,
      },
      select: {
        scenes: {
          include: {
            persons: true,
          },
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    })

    return capitule?.scenes ?? []
  }
}
