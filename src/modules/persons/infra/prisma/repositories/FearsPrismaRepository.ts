import { inject, injectable } from 'tsyringe'

import { type ICreateFearDTO } from '@modules/persons/dtos/ICreateFearDTO'
import { type IUpdateFearDTO } from '@modules/persons/dtos/IUpdateFearDTO'
import { type Prisma, type Fear } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IFearsRepository } from '../../repositories/contracts/IFearsRepository'
import { type IFear } from '../../repositories/entities/IFear'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class FearsPrismaRepository implements IFearsRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(data: ICreateFearDTO, personId: string): Promise<Fear | null> {
    const fear = await prisma.fear.create({
      data,
    })

    if (fear) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return fear
  }

  async findById(fearId: string): Promise<Fear | null> {
    const fear = await prisma.fear.findUnique({
      where: {
        id: fearId,
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

    return fear
  }

  async delete(fearId: string): Promise<void> {
    const fear = await prisma.fear.findUnique({
      where: {
        id: fearId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!fear) throw makeErrorNotFound({ whatsNotFound: 'Medo' })

    const personsToCleanInCache = fear.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__FearClient<Fear, never>
    > = [
      prisma.fear.delete({
        where: {
          id: fearId,
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
      prisma.fear.update({
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
      prisma.fear.update({
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

  async update({ data, fearId }: IUpdateFearDTO): Promise<IFear | null> {
    const fear = await prisma.fear.update({
      where: {
        id: fearId,
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

    if (!fear) throw makeErrorNotFound({ whatsNotFound: 'Medo' })

    const personsToCleanInCache = fear.persons.map((person) => person.id)

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

    return fear
  }

  async listPerPersons(personIds: string[]): Promise<IFear[]> {
    const fears = await prisma.fear.findMany({
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

    return fears
  }
}
