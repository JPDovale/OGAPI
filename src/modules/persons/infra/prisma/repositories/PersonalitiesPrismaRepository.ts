import { inject, injectable } from 'tsyringe'

import { type ICreatePersonalityDTO } from '@modules/persons/dtos/ICreatePersonalityDTO'
import { type IUpdatePersonalityDTO } from '@modules/persons/dtos/IUpdatePersonalityDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPersonalitiesRepository } from '../../repositories/contracts/IPersonalitiesRepository'
import { type IPersonality } from '../../repositories/entities/IPersonality'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

@injectable()
export class PersonalitiesPrismaRepository implements IPersonalitiesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreatePersonalityDTO,
    personId: string,
  ): Promise<IPersonality | null> {
    const personality = await prisma.personality.create({
      data,
      include: {
        consequences: true,
      },
    })

    if (personality) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return personality
  }

  async findById(personalityId: string): Promise<IPersonality | null> {
    const personality = await prisma.personality.findUnique({
      where: {
        id: personalityId,
      },
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

    return personality
  }

  async delete(personalityId: string): Promise<void> {
    const personality = await prisma.personality.findUnique({
      where: {
        id: personalityId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!personality)
      throw makeErrorNotFound({ whatsNotFound: 'Personalidade' })

    const personsToCleanInCache = personality.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__PersonalityClient<IPersonality, never>
    > = [
      prisma.personality.delete({
        where: {
          id: personalityId,
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
      prisma.personality.update({
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
      prisma.personality.update({
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
    data,
    personalityId,
  }: IUpdatePersonalityDTO): Promise<IPersonality | null> {
    const personality = await prisma.personality.update({
      where: {
        id: personalityId,
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

    if (!personality) throw makeErrorNotFound({ whatsNotFound: 'Aparência' })

    const personsToCleanInCache = personality.persons.map((person) => person.id)

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

    return personality
  }

  async listPerPersons(personIds: string[]): Promise<IPersonality[]> {
    const personalities = await prisma.personality.findMany({
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

    return personalities
  }
}
