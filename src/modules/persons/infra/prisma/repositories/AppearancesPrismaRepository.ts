import { inject, injectable } from 'tsyringe'

import { type ICreateAppearanceDTO } from '@modules/persons/dtos/ICreateAppearanceDTO'
import { type IUpdateAppearanceDTO } from '@modules/persons/dtos/IUpdateAppearanceDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IAppearancesRepository } from '../../repositories/contracts/IAppearancesRepository'
import { type IAppearance } from '../../repositories/entities/IAppearance'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class AppearancesPrismaRepository implements IAppearancesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreateAppearanceDTO,
    personId: string,
  ): Promise<IAppearance> {
    const appearance = await prisma.appearance.create({
      data,
    })

    if (appearance) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return appearance
  }

  async findById(appearanceId: string): Promise<IAppearance | null> {
    const appearance = await prisma.appearance.findUnique({
      where: {
        id: appearanceId,
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

    return appearance
  }

  async delete(appearanceId: string): Promise<void> {
    const appearance = await prisma.appearance.findUnique({
      where: {
        id: appearanceId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!appearance) throw makeErrorNotFound({ whatsNotFound: 'Aparência' })

    const personsToCleanInCache = appearance.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__AppearanceClient<IAppearance, never>
    > = [
      prisma.appearance.delete({
        where: {
          id: appearanceId,
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
      prisma.appearance.update({
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
      prisma.appearance.update({
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

  async update({
    appearanceId,
    data,
  }: IUpdateAppearanceDTO): Promise<IAppearance | null> {
    const appearance = await prisma.appearance.update({
      where: {
        id: appearanceId,
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

    if (!appearance) throw makeErrorNotFound({ whatsNotFound: 'Aparência' })

    const personsToCleanInCache = appearance.persons.map((person) => person.id)

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

    return appearance
  }

  async listPerPersons(personIds: string[]): Promise<IAppearance[]> {
    const appearances = await prisma.appearance.findMany({
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

    return appearances
  }
}
