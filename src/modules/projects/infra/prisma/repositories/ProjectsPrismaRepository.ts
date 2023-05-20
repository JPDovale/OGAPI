import { inject, injectable } from 'tsyringe'

import { type IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { type IPreviewProject } from '@modules/projects/responses/types/IPreviewProject'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import { type IProjectsRepository } from '../../repositories/contracts/IProjectsRepository'
import { type IProject } from '../../repositories/entities/IProject'
import { type IAddUsersInProject } from '../../repositories/types/IAddUsersInProject'

@injectable()
export class ProjectsPrismaRepository implements IProjectsRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private readonly defaultInclude: Prisma.ProjectInclude | null | undefined = {
    users_with_access_edit: {
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    },
    users_with_access_view: {
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    },
    users_with_access_comment: {
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    },
    books: {
      select: {
        title: true,
        subtitle: true,
        literary_genre: true,
        words: true,
        written_words: true,
        id: true,
        isbn: true,
        created_at: true,
        updated_at: true,
        front_cover_url: true,
        _count: {
          select: {
            genres: true,
            authors: true,
            capitules: true,
            comments: true,
          },
        },
      },
    },
    persons: {
      select: {
        id: true,
        name: true,
        last_name: true,
        age: true,
        born_date_timestamp: true,
        born_date: true,
        created_at: true,
        image_url: true,
        updated_at: true,
        history: true,
        _count: {
          select: {
            objectives: true,
            dreams: true,
            fears: true,
            couples: true,
            appearances: true,
            personalities: true,
            powers: true,
            traumas: true,
            values: true,
            wishes: true,
          },
        },
      },
    },
    timeLines: {
      include: {
        timeEvents: {
          include: {
            timeEventBorn: {
              include: {
                person: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            timeEventToDo: true,
          },
        },
        _count: {
          select: {
            timeEvents: true,
          },
        },
      },
    },
    user: {
      select: {
        id: true,
        avatar_url: true,
        name: true,
        email: true,
        username: true,
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
    _count: {
      select: {
        persons: true,
        books: true,
      },
    },
  }

  private async setProjectInCache(project: IProject): Promise<void> {
    await this.cacheProvider.setInfo<IProject>(
      {
        key: 'project',
        objectId: project.id,
      },
      project,
      60 * 60 * 24, // 1 day
    )
  }

  private async getProjectInCache(projectId: string): Promise<IProject | null> {
    return await this.cacheProvider.getInfo<IProject>({
      key: 'project',
      objectId: projectId,
    })
  }

  async removeProjectOfCache(projectId: string): Promise<void> {
    await this.cacheProvider.delete({
      key: 'project',
      objectId: projectId,
    })
  }

  async create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<IProject | null> {
    const project = await prisma.project.create({
      data,
      include: this.defaultInclude,
    })

    if (project) {
      this.setProjectInCache(project).catch((err) => {
        throw err
      })
    }

    return project
  }

  async findById(projectId: string): Promise<IProject | null> {
    const projectInCache = await this.getProjectInCache(projectId)
    if (projectInCache) return projectInCache

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: this.defaultInclude,
    })

    if (project) {
      this.setProjectInCache(project).catch((err) => {
        throw err
      })
    }

    return project
  }

  async addUsers({
    users,
    projectId,
    permission,
  }: IAddUsersInProject): Promise<IProject | null> {
    const usersToSetIn = users.map((user) => {
      return {
        email: user.email!,
      }
    })

    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        users_with_access_edit:
          permission === 'edit'
            ? {
                update: {
                  users: {
                    set: usersToSetIn,
                  },
                },
              }
            : undefined,
        users_with_access_view:
          permission === 'view'
            ? {
                update: {
                  users: {
                    set: usersToSetIn,
                  },
                },
              }
            : undefined,
        users_with_access_comment:
          permission === 'comment'
            ? {
                update: {
                  users: {
                    set: usersToSetIn,
                  },
                },
              }
            : undefined,
      },
      include: this.defaultInclude,
    })

    if (project) {
      this.setProjectInCache(project).catch((err) => {
        throw err
      })
    }

    return project
  }

  async delete(projectId: string): Promise<void> {
    await Promise.all([
      prisma.project.delete({
        where: {
          id: projectId,
        },
      }),

      this.cacheProvider.delete({ key: 'project', objectId: projectId }),
    ]).catch((err) => {
      throw err
    })
  }

  async update({
    data,
    projectId,
  }: IUpdateProjectDTO): Promise<IProject | null> {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data,
      include: this.defaultInclude,
    })

    if (project) {
      this.setProjectInCache(project).catch((err) => {
        throw err
      })
    }

    return project
  }

  async listAll(): Promise<IProject[]> {
    const projects = await prisma.project.findMany({
      include: this.defaultInclude,
    })

    return projects
  }

  async listProjectsOfOneUser(userId: string): Promise<IPreviewProject[]> {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            user_id: userId,
          },
          {
            users_with_access_comment: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
          {
            users_with_access_edit: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
          {
            users_with_access_view: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        image_url: true,
        name: true,
        type: true,
        created_at: true,
        features_using: true,
        initial_date: true,
        initial_date_timestamp: true,
        user: {
          select: {
            avatar_url: true,
            username: true,
            id: true,
            name: true,
            email: true,
          },
        },
        users_with_access_comment: {
          select: {
            users: {
              select: {
                avatar_url: true,
                id: true,
                username: true,
              },
            },
          },
        },
        users_with_access_view: {
          select: {
            users: {
              select: {
                avatar_url: true,
                id: true,
                username: true,
              },
            },
          },
        },
        users_with_access_edit: {
          select: {
            users: {
              select: {
                avatar_url: true,
                id: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            books: true,
            persons: true,
            timeLines: true,
          },
        },
      },
    })

    return projects
  }

  async listPersonsIds(projectId: string): Promise<string[]> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        persons: {
          select: {
            id: true,
          },
        },
      },
    })

    const personIds = project?.persons.map((person) => person.id) ?? []

    return personIds
  }
}
