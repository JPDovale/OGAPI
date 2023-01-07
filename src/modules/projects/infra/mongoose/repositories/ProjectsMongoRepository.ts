import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { IDateProvider } from '@shared/container/provides/DateProvider/IDateProvider'

import {
  IProjectMongo,
  ISharedWhitUsers,
  ProjectMongo,
} from '../entities/Project'
import { ITag } from '../entities/Tag'

@injectable()
export class ProjectsMongoRepository implements IProjectsRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

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
      users,
      name,
      private: priv,
      type,
      password,
      plot,
    })

    await newProject.save()

    return newProject
  }

  async listPerUser(userId: string): Promise<IProjectMongo[]> {
    const allProjects = await ProjectMongo.find()
    const projects = allProjects.filter((project) => {
      const userExiste = project.users.find((user) => user.id === userId)
      if (userExiste) {
        return true
      } else {
        return false
      }
    })
    return projects
  }

  async findById(id: string): Promise<IProjectMongo> {
    const project = await ProjectMongo.findOne({ id })
    return project
  }

  async addUsers(
    users: ISharedWhitUsers[],
    id: string,
  ): Promise<IProjectMongo> {
    await ProjectMongo.findOneAndUpdate({ id }, { users })

    const updatedProject = await ProjectMongo.findOne({ id })
    return updatedProject
  }

  async updateImage(image: IAvatar, id: string): Promise<IProjectMongo> {
    await ProjectMongo.findOneAndUpdate(
      { id },
      { image, updateAt: this.dateProvider.getDate(new Date()) },
    )
    const updatedProject = await ProjectMongo.findOne({ id })
    return updatedProject
  }

  async delete(id: string): Promise<void> {
    await ProjectMongo.findOneAndDelete({ id })
  }

  async updatePlot(id: string, plot: IUpdatePlotDTO): Promise<IProjectMongo> {
    await ProjectMongo.findOneAndUpdate(
      { id },
      { plot, updateAt: this.dateProvider.getDate(new Date()) },
    )

    const updatedProject = await ProjectMongo.findOne({ id })

    return updatedProject
  }

  async updateTag(id: string, tags: ITag[]): Promise<void> {
    await ProjectMongo.findOneAndUpdate(
      { id },
      { tags, updateAt: this.dateProvider.getDate(new Date()) },
    )
  }

  async deletePerUserId(userId: string): Promise<void> {
    await ProjectMongo.deleteMany({ createdPerUser: userId })
  }
}
