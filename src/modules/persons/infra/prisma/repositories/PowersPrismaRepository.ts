import { inject, injectable } from 'tsyringe'

import { type ICreatePowerDTO } from '@modules/persons/dtos/ICreatePowerDTO'
import { type IUpdatePowerDTO } from '@modules/persons/dtos/IUpdatePowerDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPowersRepository } from '../../repositories/contracts/IPowersRepository'
import { type IPower } from '../../repositories/entities/IPower'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class PowersPrismaRepository implements IPowersRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreatePowerDTO,
    personId: string,
  ): Promise<IPower | null> {
    const power = await prisma.power.create({
      data,
    })

    if (power) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return power
  }

  async findById(powerId: string): Promise<IPower | null> {
    const power = await prisma.power.findUnique({
      where: {
        id: powerId,
      },
      include: {
        persons: {
          select: { image_url: true, name: true, id: true },
        },
      },
    })

    return power
  }

  async delete(powerId: string): Promise<void> {
    const power = await prisma.power.findUnique({
      where: {
        id: powerId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!power) throw makeErrorNotFound({ whatsNotFound: 'Poder' })

    const personsToCleanInCache = power.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__PowerClient<IPower, never>
    > = [
      prisma.power.delete({
        where: {
          id: powerId,
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
      prisma.power.update({
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
      prisma.power.update({
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

  async update({ data, powerId }: IUpdatePowerDTO): Promise<IPower | null> {
    const power = await prisma.power.update({
      where: {
        id: powerId,
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

    if (!power) throw makeErrorNotFound({ whatsNotFound: 'Poder' })

    const personsToCleanInCache = power.persons.map((person) => person.id)

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

    return power
  }

  async listPerPersons(personIds: string[]): Promise<IPower[]> {
    const powers = await prisma.power.findMany({
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

    return powers
  }
}
