import { inject, injectable } from 'tsyringe'
import { v4 as uuidV4 } from 'uuid'

import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { type IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'

import { type IPlotProject } from '../entities/Plot'
import {
  type IProjectMongo,
  type ISharedWhitUsers,
  ProjectMongo,
} from '../entities/Project'
import { type IUpdateName } from './types/IUpdateName'

@injectable()
export class ProjectsMongoRepository implements IProjectsRepository {
  constructor(
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider,
  ) {}

  async create(
    dataProjectObj: ICreateProjectDTO,
  ): Promise<IProjectMongo | null | undefined> {
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

  async findById(id: string): Promise<IProjectMongo | null | undefined> {
    const project = await ProjectMongo.findOne({ id })
    return project
  }

  async addUsers(
    users: ISharedWhitUsers[],
    id: string,
  ): Promise<IProjectMongo | null | undefined> {
    await ProjectMongo.findOneAndUpdate({ id }, { users })

    const updatedProject = await ProjectMongo.findOne({ id })
    return updatedProject
  }

  async updateImage(
    image: IAvatar,
    id: string,
  ): Promise<IProjectMongo | null | undefined> {
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

  async updatePlot(
    id: string,
    plot: IPlotProject,
  ): Promise<IProjectMongo | null | undefined> {
    await ProjectMongo.findOneAndUpdate(
      { id },
      { plot, updateAt: this.dateProvider.getDate(new Date()) },
    )

    const updatedProject = await ProjectMongo.findOne({ id })

    return updatedProject
  }

  async deletePerUserId(userId: string): Promise<void> {
    await ProjectMongo.deleteMany({ createdPerUser: userId })
  }

  async listAll(): Promise<IProjectMongo[]> {
    const allProjects = await ProjectMongo.find()
    return allProjects
  }

  async updateName({
    id,
    name,
  }: IUpdateName): Promise<IProjectMongo | null | undefined> {
    await ProjectMongo.updateOne(
      { id },
      { name, updateAt: this.dateProvider.getDate(new Date()) },
    )

    const project = await ProjectMongo.findOne({ id })
    return project
  }

  async removeTagsInAllProjects(): Promise<void> {
    await ProjectMongo.updateMany({}, { $unset: { tags: 1 } })
  }
}
