import { v4 as uuidV4 } from 'uuid'

import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

import { IProjectMongo, ProjectMongo } from '../entities/Project'

export class ProjectsMongoRepository implements IProjectsRepository {
  async create(dataProjectObj: ICreateProjectDTO): Promise<IProjectMongo> {
    const {
      createdPerUser,
      name,
      private: priv,
      type,
      password,
    } = dataProjectObj

    const newProject = new ProjectMongo({
      id: uuidV4(),
      createdPerUser,
      users: [createdPerUser],
      name,
      private: priv,
      type,
      password,
    })

    await newProject.save()

    return newProject
  }
}
