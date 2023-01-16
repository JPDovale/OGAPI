import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import {
  IProjectMongo,
  ISharedWhitUsers,
  ProjectMongo,
} from '@modules/projects/infra/mongoose/entities/Project'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'

import { IProjectsRepository } from '../IProjectRepository'

export class ProjectsRepositoryInMemory implements IProjectsRepository {
  projects: IProjectMongo[] = []

  async create(dataProjectObj: ICreateProjectDTO): Promise<IProjectMongo> {
    const {
      name,
      private: priv,
      type,
      password,
      createdPerUser,
    } = dataProjectObj

    const newProject = new ProjectMongo()

    Object.assign(newProject, {
      name,
      type,
      password,
      private: priv,
      createdPerUser,
    })

    this.projects.push(newProject)

    return newProject
  }

  listPerUser: (userId: string) => Promise<IProjectMongo[]>
  findById: (projectId: string) => Promise<IProjectMongo>
  addUsers: (
    users: ISharedWhitUsers[],
    projectId: string,
  ) => Promise<IProjectMongo>

  updateImage: (image: IAvatar, projectId: string) => Promise<IProjectMongo>
  delete: (projectId: string) => Promise<void>
  updatePlot: (
    projectId: string,
    plot: IUpdatePlotDTO,
  ) => Promise<IProjectMongo>

  updateTag: (projectId: string, tags: ITag[]) => Promise<void>
  async deletePerUserId(userId: string): Promise<void> {
    const filteredProjects = this.projects.filter(
      (project) => project.createdPerUser !== userId,
    )

    this.projects = filteredProjects
  }
}
