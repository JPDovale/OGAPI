import { inject, injectable } from 'tsyringe'

import { type IUpdatePersonDTO } from '@modules/persons/dtos/IUpdatePersonDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { prisma } from '@shared/infra/database/createConnection'

import { type IPersonsRepository } from '../../repositories/contracts/IPersonsRepository'
import { type IPerson } from '../../repositories/entities/IPerson'

const defaultInclude: Prisma.PersonInclude = {
  couples: {
    include: {
      coupleWithPerson: true,
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  coupleWithPersons: {
    include: {
      couple: {
        include: {
          coupleWithPerson: true,
          comments: {
            include: {
              responses: {
                orderBy: {
                  created_at: 'desc',
                },
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      },
    },
  },
  appearances: {
    include: {
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  dreams: {
    include: {
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  fears: {
    include: {
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  objectives: {
    include: {
      avoiders: {
        include: {
          persons: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
        },
      },
      supporters: {
        include: {
          persons: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
        },
      },
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  personalities: {
    include: {
      consequences: true,
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  powers: {
    include: {
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  traumas: {
    include: {
      consequences: true,
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  values: {
    include: {
      exceptions: true,
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
  wishes: {
    include: {
      comments: {
        include: {
          responses: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  },
}
@injectable()
export class PersonsPrismaRepository implements IPersonsRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async getPersonInCache(personId: string): Promise<IPerson | null> {
    return await this.cacheProvider.getInfo<IPerson>({
      key: 'person',
      objectId: personId,
    })
  }

  private async setPersonInCache(person: IPerson): Promise<void> {
    await this.cacheProvider.setInfo<IPerson>(
      {
        key: 'person',
        objectId: person.id,
      },
      person,
      60 * 60 * 1, // 1 day
    )
  }

  async create(
    data: Prisma.PersonUncheckedCreateInput,
  ): Promise<IPerson | null> {
    const person = await prisma.person.create({
      data,
      include: defaultInclude,
    })

    if (person) {
      Promise.all([
        this.setPersonInCache(person),
        this.cacheProvider.delete({
          key: 'project',
          objectId: person.project_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return person
  }

  async findById(personId: string): Promise<IPerson | null> {
    const personInCache = await this.getPersonInCache(personId)
    if (personInCache) return personInCache

    const person = await prisma.person.findFirst({
      where: {
        id: personId,
      },
      include: defaultInclude,
    })

    if (person) {
      this.setPersonInCache(person).catch((err) => {
        throw err
      })
    }

    return person
  }

  async updatePerson({
    data,
    personId,
  }: IUpdatePersonDTO): Promise<IPerson | null> {
    const person = await prisma.person.update({
      where: {
        id: personId,
      },
      data,
      include: defaultInclude,
    })

    if (person) {
      Promise.all([
        this.setPersonInCache(person),

        this.cacheProvider.delete({
          key: 'project',
          objectId: person.project_id,
        }),
      ]).catch((err) => {
        throw err
      })
    }

    return person
  }

  async listAll(): Promise<IPerson[]> {
    throw new Error('Method not implemented.')
  }

  async delete(personId: string): Promise<void> {
    const person = await prisma.person.findUnique({
      where: {
        id: personId,
      },
      select: {
        project_id: true,
        scenes: {
          select: {
            capitule_id: true,
          },
        },
      },
    })

    if (!person) throw makeErrorPersonNotFound()

    const capitulesToCleanInCache = person.scenes.map(
      (scene) => scene.capitule_id,
    )
    const uniqueCapitulesToCleanInCache = capitulesToCleanInCache.filter(
      (capitule, index, self) => self.indexOf(capitule) === index,
    )

    const promises = [
      prisma.person.delete({
        where: {
          id: personId,
        },
      }),

      this.cacheProvider.delete({
        key: 'person',
        objectId: personId,
      }),

      this.cacheProvider.delete({
        key: 'project',
        objectId: person.project_id,
      }),
    ]

    uniqueCapitulesToCleanInCache.map((capituleToCleanInCache) =>
      promises.push(
        this.cacheProvider.delete({
          key: 'capitule',
          objectId: capituleToCleanInCache,
        }),
      ),
    )

    await Promise.all(promises).catch((err) => {
      throw err
    })
  }
}
