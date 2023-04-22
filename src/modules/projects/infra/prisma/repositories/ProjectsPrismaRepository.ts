import { type IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { type IPreviewProject } from '@modules/projects/responses/IPreviewProject'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IProjectsRepository } from '../../repositories/contracts/IProjectsRepository'
import { type IProject } from '../../repositories/entities/IProject'
import { type IProjectToVerifyPermission } from '../../repositories/entities/IProjectToVerifyPermission'
import { type IAddUsersInProject } from '../../repositories/types/IAddUsersInProject'
import { type IUpdateImage } from '../../repositories/types/IUpdateImage'

export class ProjectsPrismaRepository implements IProjectsRepository {
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
        responses: true,
      },
    },
    _count: {
      select: {
        persons: true,
        books: true,
      },
    },
  }

  async create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<IProject | null> {
    const project = await prisma.project.create({
      data,
    })

    return project
  }

  async findById(projectId: string): Promise<IProject | null> {
    const project = prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: this.defaultInclude,
    })

    return await project
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

    return project
  }

  async updateImage({
    imageFilename,
    imageUrl,
    projectId,
  }: IUpdateImage): Promise<IProject | null> {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        image_filename: imageFilename,
        image_url: imageUrl,
      },
      include: this.defaultInclude,
    })

    return project
  }

  async delete(projectId: string): Promise<void> {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
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

    return project
  }

  async listAll(): Promise<IProject[]> {
    const projects = await prisma.project.findMany({
      include: this.defaultInclude,
    })

    return projects
  }

  async listProjectsOfOneUser(userId: string): Promise<IPreviewProject[]> {
    const projects = prisma.project.findMany({
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
        user: {
          select: {
            avatar_url: true,
            username: true,
            id: true,
          },
        },
        users_with_access_comment: {
          select: {
            users: {
              select: {
                avatar_url: true,
                id: true,
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
              },
            },
          },
        },
        _count: {
          select: {
            books: true,
            persons: true,
          },
        },
      },
    })

    return await projects
  }

  async findOneToVerifyPermission(
    projectId: string,
  ): Promise<IProjectToVerifyPermission | null> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
          },
        },
        users_with_access_edit: {
          include: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
        users_with_access_view: {
          include: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
        users_with_access_comment: {
          include: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    return project
  }
}
