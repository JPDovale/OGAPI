import { type IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type IProjectsRepository } from '../../repositories/contracts/IProjectsRepository'
import { type IProject } from '../../repositories/entities/IProject'
import { type IAddUsersInProject } from '../../repositories/types/IAddUsersInProject'
import { type IUpdateImage } from '../../repositories/types/IUpdateImage'

export class ProjectsPrismaRepository implements IProjectsRepository {
  private readonly defaultInclude: Prisma.ProjectInclude | null | undefined = {
    users_with_access_edit: {
      include: {
        users: true,
      },
    },
    users_with_access_view: {
      include: {
        users: true,
      },
    },
    users_with_access_comment: {
      include: {
        users: true,
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
                    set: users,
                  },
                },
              }
            : undefined,
        users_with_access_view:
          permission === 'view'
            ? {
                update: {
                  users: {
                    set: users,
                  },
                },
              }
            : undefined,
        users_with_access_comment:
          permission === 'comment'
            ? {
                update: {
                  users: {
                    set: users,
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
}
