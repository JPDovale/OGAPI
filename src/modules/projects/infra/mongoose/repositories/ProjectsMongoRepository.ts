import { injectable } from 'tsyringe'

import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'
import { type IProjectsRepository } from '@modules/projects/infra/repositories/contracts/IProjectsRepository'
import { type Prisma } from '@prisma/client'

import { type IProject } from '../../repositories/entities/IProject'
import { type IAddUsersInProject } from '../../repositories/types/IAddUsersInProject'
import { type IUpdateImage } from '../../repositories/types/IUpdateImage'
import { ProjectMongo } from '../entities/Project'

@injectable()
export class ProjectsMongoRepository implements IProjectsRepository {
  async createMany(data: any): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async create(
    data: Prisma.ProjectUncheckedCreateInput,
  ): Promise<IProject | null> {
    throw new Error('Method not implemented.')
  }

  async findById(projectId: string): Promise<IProject | null> {
    throw new Error('Method not implemented.')
  }

  async addUsers(data: IAddUsersInProject): Promise<IProject | null> {
    throw new Error('Method not implemented.')
  }

  async updateImage(data: IUpdateImage): Promise<IProject | null> {
    throw new Error('Method not implemented.')
  }

  async delete(projectId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async update(data: IUpdateProjectDTO): Promise<IProject | null> {
    throw new Error('Method not implemented.')
  }

  async listAll(): Promise<IProject[]> {
    const projects = await ProjectMongo.find()
    return projects as unknown as IProject[]
  }
}
