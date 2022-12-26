import { v4 as uuidV4 } from 'uuid'

import { ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { IUpdatePlotDTO } from '@modules/projects/dtos/IUpdatePlotDTO'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

import {
  IProjectMongo,
  ISharedWhitUsers,
  ProjectMongo,
} from '../entities/Project'
import { ITagMongo } from '../entities/Tag'

export class ProjectsMongoRepository implements IProjectsRepository {
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
    if (!id) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    const project = await ProjectMongo.findOne({ id })
    return project
  }

  async addUsers(users: ISharedWhitUsers[], id: string): Promise<void> {
    if (!users) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    await ProjectMongo.findOneAndUpdate({ id }, { users })
  }

  async updateImage(url: string, id: string): Promise<void> {
    if (!url || !id) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    await ProjectMongo.findOneAndUpdate(
      { id },
      { image: url, updateAt: new Date() },
    )
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      await ProjectMongo.findOneAndDelete({ id })
    } catch (err) {
      throw new AppError('Não foi possível deletar o projeto', 500)
    }
  }

  async updatePlot(id: string, plot: IUpdatePlotDTO): Promise<IProjectMongo> {
    if (!id || !plot) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      await ProjectMongo.findOneAndUpdate(
        { id },
        { plot, updateAt: new Date() },
      )

      const updatedProject = await ProjectMongo.findOne({ id })

      return updatedProject
    } catch (err) {
      throw new AppError('Não foi possível atualizar o projeto', 500)
    }
  }

  async updateTag(id: string, tags: ITagMongo[]): Promise<void> {
    if (!id || !tags) {
      throw new AppError(
        'Algumas informações estão ausentes na requisição, porem são indispensáveis para o funcionamento.',
        409,
      )
    }

    try {
      await ProjectMongo.findOneAndUpdate(
        { id },
        { tags, updateAt: new Date() },
      )
    } catch (err) {
      throw new AppError('Não foi possível atualizar as tags do projeto', 500)
    }
  }
}
