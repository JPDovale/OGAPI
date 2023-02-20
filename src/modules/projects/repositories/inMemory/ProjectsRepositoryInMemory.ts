import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import {
  IProjectMongo,
  ISharedWhitUsers,
  ProjectMongo,
} from '@modules/projects/infra/mongoose/entities/Project'
import { ITag } from '@modules/projects/infra/mongoose/entities/Tag'
import { IUpdateName } from '@modules/projects/infra/mongoose/repositories/types/IUpdateName'

import { IProjectsRepository } from '../IProjectRepository'

export class ProjectsRepositoryInMemory implements IProjectsRepository {
  projects: IProjectMongo[] = []

  async create(dataProjectObj: ICreateProjectDTO): Promise<IProjectMongo> {
    const {
      createdPerUser,
      name,
      private: priv,
      type,
      password,
      users,
      plot,
    } = dataProjectObj

    const newProject = new ProjectMongo()

    Object.assign(newProject, {
      createdPerUser,
      name,
      private: priv,
      type,
      password,
      users,
      plot,
    })

    this.projects.push(newProject)

    return newProject
  }

  async listPerUser(userId: string): Promise<IProjectMongo[]> {
    const projectsOfUser = this.projects.filter(
      (project) => project.createdPerUser === userId,
    )

    return projectsOfUser
  }

  async findById(id: string): Promise<IProjectMongo> {
    const project = this.projects.find((project) => project.id === id)

    return project
  }

  addUsers: (
    users: ISharedWhitUsers[],
    projectId: string,
  ) => Promise<IProjectMongo>

  updateImage: (image: IAvatar, projectId: string) => Promise<IProjectMongo>

  async delete(projectId: string): Promise<void> {
    this.projects = this.projects.filter((project) => project.id !== projectId)
  }

  updatePlot: (
    projectId: string,
    plot: IUpdatePlotDTO,
  ) => Promise<IProjectMongo>

  async deletePerUserId(userId: string): Promise<void> {
    const filteredProjects = this.projects.filter(
      (project) => project.createdPerUser !== userId,
    )

    this.projects = filteredProjects
  }

  updateTag: (projectId: string, tags: ITag[]) => Promise<IProjectMongo>
  listAll: () => Promise<IProjectMongo[]>
  updateName: ({ id, name }: IUpdateName) => Promise<IProjectMongo>
}
