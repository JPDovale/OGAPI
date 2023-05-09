import { inject, injectable } from 'tsyringe'

import { type ICreateObjectiveDTO } from '@modules/persons/dtos/ICreateObjectiveDTO'
import { type IUpdateObjectiveDTO } from '@modules/persons/dtos/IUpdateObjectiveDTO'
import { type Objective, type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorNotFound } from '@shared/errors/useFull/makeErrorNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IObjectivesRepository } from '../../repositories/contracts/IObjectivesRepository'
import { type IObjective } from '../../repositories/entities/IObjective'
import { type IAddOnePersonInObject } from '../../repositories/types/IAddOnePersonInObject'
import { type IRemoveOnePersonById } from '../../repositories/types/IRemoveOnePersonById'

const defaultInclude: Prisma.ObjectiveInclude = {
  avoiders: {
    include: {
      persons: {
        select: {
          image_url: true,
          name: true,
          id: true,
        },
      },
    },
  },
  supporters: {
    include: {
      persons: {
        select: {
          image_url: true,
          name: true,
          id: true,
        },
      },
    },
  },
}

@injectable()
export class ObjectivesPrismaRepository implements IObjectivesRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: ICreateObjectiveDTO,
    personId: string,
  ): Promise<Objective | null> {
    const objective = await prisma.objective.create({
      data,
      include: defaultInclude,
    })

    if (objective) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: personId,
        })
        .catch((err) => {
          throw err
        })
    }

    return objective
  }

  async findById(objectiveId: string): Promise<Objective | null> {
    const objective = await prisma.objective.findUnique({
      where: {
        id: objectiveId,
      },
      include: {
        ...defaultInclude,
        _count: {
          select: {
            persons: true,
          },
        },
      },
    })

    return objective
  }

  async delete(objectiveId: string): Promise<void> {
    const objective = await prisma.objective.findUnique({
      where: {
        id: objectiveId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!objective) throw makeErrorNotFound({ whatsNotFound: 'Objetivo' })

    const personsToCleanInCache = objective.persons.map((person) => person.id)

    const promises: Array<
      Promise<void> | Prisma.Prisma__ObjectiveClient<Objective, never>
    > = [
      prisma.objective.delete({
        where: {
          id: objectiveId,
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
      prisma.objective.update({
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
      prisma.objective.update({
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
    objectiveId,
  }: IUpdateObjectiveDTO): Promise<IObjective | null> {
    const objective = await prisma.objective.update({
      where: {
        id: objectiveId,
      },
      data,
      include: defaultInclude,
    })
    if (!objective) throw makeErrorNotFound({ whatsNotFound: 'Objetivo' })

    const personsToCleanInCache =
      objective.persons?.map((person) => person.id) ?? []

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

    return objective
  }

  async listPerPersons(personIds: string[]): Promise<IObjective[]> {
    const objectives = await prisma.objective.findMany({
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
        avoiders: {
          include: {
            _count: {
              select: {
                persons: true,
              },
            },
          },
        },
        supporters: {
          include: {
            _count: {
              select: {
                persons: true,
              },
            },
          },
        },
      },
    })

    return objectives
  }
}
