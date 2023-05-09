import { inject, injectable } from 'tsyringe'

import { type ICreateWisheDTO } from '@modules/persons/dtos/ICreateWisheDTO'
import { type IUpdateWisheDTO } from '@modules/persons/dtos/IUpdateWisheDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IWishesRepository } from '../../repositories/contracts/IWishesRepository'
import { type IWishe } from '../../repositories/entities/IWishe'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class WishesPrismaRepository implements IWishesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreateWisheDTO,
    personId: string,
  ): Promise<IWishe | null> {
    const wishe = await prisma.wishe.create({
      data,
    })

    if (wishe) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return wishe
  }

  async findById(wisheId: string): Promise<IWishe | null> {
    const wishe = await prisma.wishe.findUnique({
      where: {
        id: wisheId,
      },
      include: {
        persons: {
          select: {
            image_url: true,
            name: true,
            id: true,
          },
        },
      },
    })

    return wishe
  }

  async delete(wisheId: string): Promise<void> {
    const wishe = await prisma.wishe.findUnique({
      where: {
        id: wisheId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!wishe) throw makeErrorNotFound({ whatsNotFound: 'Desejo' })

    const personsToCleanInCache = wishe.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__WisheClient<IWishe, never>
    > = [
      prisma.wishe.delete({
        where: {
          id: wisheId,
        },
      }),
    ]

    personsToCleanInCache.map((personToCleanInCache) =>
      promises.push(
        this.cacheProvider.delete({
          key: 'person',
          objectId: personToCleanInCache,
        }),
      ),
    )

    await Promise.all(promises).catch((err) => {
      throw err
    })
  }

  async removeOnePersonById({
    objectId,
    personId,
  }: IRemoveOnePersonById): Promise<void> {
    await Promise.all([
      prisma.wishe.update({
        where: {
          id: objectId,
        },
        data: {
          persons: {
            disconnect: {
              id: personId,
            },
          },
        },
      }),
      this.cacheProvider.delete({ key: 'person', objectId: personId }),
    ]).catch((err) => {
      throw err
    })
  }

  async addPerson({
    objectId,
    personId,
  }: IAddOnePersonInObject): Promise<void> {
    await Promise.all([
      prisma.wishe.update({
        where: {
          id: objectId,
        },
        data: {
          persons: {
            connect: {
              id: personId,
            },
          },
        },
      }),
      this.cacheProvider.delete({ key: 'person', objectId: personId }),
    ]).catch((err) => {
      throw err
    })
  }

  async update({ data, wisheId }: IUpdateWisheDTO): Promise<IWishe | null> {
    const wishe = await prisma.wishe.update({
      where: {
        id: wisheId,
      },
      data,
      include: {
        persons: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
      },
    })

    if (!wishe) throw makeErrorNotFound({ whatsNotFound: 'Desejo' })

    const personsToCleanInCache = wishe.persons.map((person) => person.id)

    Promise.all(
      personsToCleanInCache.map(async (personToCleanInCache) => {
        await this.cacheProvider.delete({
          key: 'person',
          objectId: personToCleanInCache,
        })
      }),
    ).catch((err) => {
      throw err
    })

    return wishe
  }

  async listPerPersons(personIds: string[]): Promise<IWishe[]> {
    const wishes = await prisma.wishe.findMany({
      where: {
        persons: {
          some: {
            id: {
              in: personIds,
            },
          },
        },
      },
      include: {
        persons: {
          select: {
            image_url: true,
            name: true,
            id: true,
          },
        },
      },
    })

    return wishes
  }
}
