import { inject, injectable } from 'tsyringe'

import { type ICreateValueDTO } from '@modules/persons/dtos/ICreateValueDTO'
import { type IUpdateValueDTO } from '@modules/persons/dtos/IUpdateValueDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IValuesRepository } from '../../repositories/contracts/IValuesRepository'
import { type IValue } from '../../repositories/entities/IValue'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class ValuesPrismaRepository implements IValuesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreateValueDTO,
    personId: string,
  ): Promise<IValue | null> {
    const value = await prisma.value.create({
      data,
      include: {
        exceptions: true,
      },
    })

    if (value) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return value
  }

  async findById(valueId: string): Promise<IValue | null> {
    const value = await prisma.value.findUnique({
      where: {
        id: valueId,
      },
      include: {
        exceptions: true,
        persons: {
          select: {
            image_url: true,
            name: true,
            id: true,
          },
        },
      },
    })

    return value
  }

  async delete(valueId: string): Promise<void> {
    const value = await prisma.value.findUnique({
      where: {
        id: valueId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!value) throw makeErrorNotFound({ whatsNotFound: 'Valor' })

    const personsToCleanInCache = value.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__ValueClient<IValue, never>
    > = [
      prisma.value.delete({
        where: {
          id: valueId,
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
      prisma.value.update({
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
      prisma.value.update({
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

  async update({ data, valueId }: IUpdateValueDTO): Promise<IValue | null> {
    const value = await prisma.value.update({
      where: {
        id: valueId,
      },
      data,
      include: {
        exceptions: true,
        persons: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
      },
    })

    if (!value) throw makeErrorNotFound({ whatsNotFound: 'Valor' })

    const personsToCleanInCache = value.persons.map((person) => person.id)

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

    return value
  }

  async listPerPersons(personIds: string[]): Promise<IValue[]> {
    const values = await prisma.value.findMany({
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
        exceptions: true,
      },
    })

    return values
  }
}
