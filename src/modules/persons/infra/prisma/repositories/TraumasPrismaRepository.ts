import { inject, injectable } from 'tsyringe'

import { type ICreateTraumaDTO } from '@modules/persons/dtos/ICreateTraumaDTO'
import { type IUpdateTraumaDTO } from '@modules/persons/dtos/IUpdateTraumaDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type ITraumasRepository } from '../../repositories/contracts/ITraumasRepository'
import { type ITrauma } from '../../repositories/entities/ITrauma'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class TraumasPrismaRepository implements ITraumasRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreateTraumaDTO,
    personId: string,
  ): Promise<ITrauma | null> {
    const trauma = await prisma.trauma.create({
      data,
      include: {
        consequences: true,
      },
    })

    if (trauma) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return trauma
  }

  async findById(traumaId: string): Promise<ITrauma | null> {
    const trauma = await prisma.trauma.findUnique({
      where: {
        id: traumaId,
      },
      include: {
        consequences: true,
        persons: {
          select: {
            image_url: true,
            name: true,
            id: true,
          },
        },
      },
    })

    return trauma
  }

  async delete(traumaId: string): Promise<void> {
    const trauma = await prisma.trauma.findUnique({
      where: {
        id: traumaId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!trauma) throw makeErrorNotFound({ whatsNotFound: 'Trauma' })

    const personsToCleanInCache = trauma.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__TraumaClient<ITrauma, never>
    > = [
      prisma.trauma.delete({
        where: {
          id: traumaId,
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
      prisma.trauma.update({
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
      prisma.trauma.update({
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

  async update({ data, traumaId }: IUpdateTraumaDTO): Promise<ITrauma | null> {
    const trauma = await prisma.trauma.update({
      where: {
        id: traumaId,
      },
      data,
      include: {
        consequences: true,
        persons: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
      },
    })

    if (!trauma) throw makeErrorNotFound({ whatsNotFound: 'Trauma' })

    const personsToCleanInCache = trauma.persons.map((person) => person.id)

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

    return trauma
  }

  async listPerPersons(personIds: string[]): Promise<ITrauma[]> {
    const traumas = await prisma.trauma.findMany({
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
        consequences: true,
      },
    })

    return traumas
  }
}
