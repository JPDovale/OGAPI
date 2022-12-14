import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import {
  IProjectMongo,
  ProjectMongo,
} from '@modules/projects/infra/mongoose/entities/Project'

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
}
