import { inject, injectable } from 'tsyringe'

import { type ICreateDreamDTO } from '@modules/persons/dtos/ICreateDreamDTO'
import { type IUpdateDreamDTO } from '@modules/persons/dtos/IUpdateDreamDTO'
import { type Prisma, type Dream } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IDreamsRepository } from '../../repositories/contracts/IDreamsRepository'
import { type IDream } from '../../repositories/entities/IDream'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class DreamsPrismaRepository implements IDreamsRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(data: ICreateDreamDTO, personId: string): Promise<Dream | null> {
    const dream = await prisma.dream.create({
      data,
    })

    if (dream) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return dream
  }

  async findById(dreamId: string): Promise<Dream | null> {
    const dream = await prisma.dream.findUnique({
      where: {
        id: dreamId,
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

    return dream
  }

  async delete(dreamId: string): Promise<void> {
    const dream = await prisma.dream.findUnique({
      where: {
        id: dreamId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!dream) throw makeErrorNotFound({ whatsNotFound: 'Sonho' })

    const personsToCleanInCache = dream.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__DreamClient<Dream, never>
    > = [
      prisma.dream.delete({
        where: {
          id: dreamId,
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
      prisma.dream.update({
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
      prisma.dream.update({
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

  async update({ data, dreamId }: IUpdateDreamDTO): Promise<IDream | null> {
    const dream = await prisma.dream.update({
      where: {
        id: dreamId,
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

    if (!dream) throw makeErrorNotFound({ whatsNotFound: 'Sonho' })

    const personsToCleanInCache = dream.persons.map((person) => person.id)

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

    return dream
  }

  async listPerPersons(personIds: string[]): Promise<IDream[]> {
    const dreams = await prisma.dream.findMany({
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

    return dreams
  }
}
