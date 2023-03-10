import { v4 as uuidV4 } from 'uuid'

import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import {
  IProjectMongo,
  ISharedWhitUsers,
  ProjectMongo,
} from '@modules/projects/infra/mongoose/entities/Project'
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

    const newProject = new ProjectMongo({
      id: uuidV4(),
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

  async addUsers(
    users: ISharedWhitUsers[],
    projectId: string,
  ): Promise<IProjectMongo> {
    const indexOfProjectToUpdate = this.projects.findIndex(
      (project) => project.id === projectId,
    )
    this.projects[indexOfProjectToUpdate].users = users

    const projectUpdated = this.projects.find(
      (project) => project.id === projectId,
    )
    return projectUpdated
  }

  updateImage: (image: IAvatar, projectId: string) => Promise<IProjectMongo>

  async delete(projectId: string): Promise<void> {
    this.projects = this.projects.filter((project) => project.id !== projectId)
  }

  async updatePlot(
    projectId: string,
    plot: IUpdatePlotDTO,
  ): Promise<IProjectMongo> {
    const indexOfProjectToUpdate = this.projects.findIndex(
      (project) => project.id === projectId,
    )
    this.projects[indexOfProjectToUpdate].plot = plot

    const projectUpdated = this.projects.find(
      (project) => project.id === projectId,
    )
    return projectUpdated
  }

  async deletePerUserId(userId: string): Promise<void> {
    const filteredProjects = this.projects.filter(
      (project) => project.createdPerUser !== userId,
    )

    this.projects = filteredProjects
  }

  listAll: () => Promise<IProjectMongo[]>

  async updateName({ id, name }: IUpdateName): Promise<IProjectMongo> {
    const indexOfProjectToUpdate = this.projects.findIndex(
      (project) => project.id === id,
    )

    this.projects[indexOfProjectToUpdate].name = name

    return this.projects[indexOfProjectToUpdate]
  }

  removeTagsInAllProjects: () => Promise<void>
}
