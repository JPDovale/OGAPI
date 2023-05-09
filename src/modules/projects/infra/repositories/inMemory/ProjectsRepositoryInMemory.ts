import { randomUUID } from 'node:crypto'

import { type ICreateProjectDTO } from '@modules/projects/dtos/ICreateProjectDTO'
import { type IUpdateProjectDTO } from '@modules/projects/dtos/IUpdateProjectDTO'

import { type IProjectsRepository } from '../contracts/IProjectsRepository'
import { type IProject } from '../entities/IProject'
import { type IAddUsersInProject } from '../types/IAddUsersInProject'
import { type IUpdateImage } from '../types/IUpdateImage'

export class ProjectsRepositoryInMemory implements IProjectsRepository {
  projects: IProject[] = []

  async create(data: ICreateProjectDTO): Promise<IProject | null> {
    const project: IProject = {
      ambient: data.ambient ?? null,
      count_time: data.count_time ?? null,
      created_at: new Date(),
      details: data.details ?? null,
      historical_fact: data.historical_fact ?? null,
      id: randomUUID(),
      image_filename: data.image_filename ?? null,
      image_url: data.image_url ?? null,
      literary_genre: data.literary_genre ?? null,
      name: data.name,
      one_phrase: data.one_phrase ?? null,
      password: data.password ?? null,
      premise: data.premise ?? null,
      private: data.private ?? false,
      storyteller: data.storyteller ?? null,
      structure_act_1: data.structure_act_1 ?? null,
      structure_act_2: data.structure_act_2 ?? null,
      structure_act_3: data.structure_act_3 ?? null,
      subgenre: data.subgenre ?? null,
      summary: data.summary ?? null,
      type: data.type ?? 'book',
      updated_at: new Date(),
      url_text: data.url_text ?? null,
      user_id: data.user_id,
    }

    this.projects.push(project)

    return project
  }

  async findById(projectId: string): Promise<IProject | null> {
    const project = this.projects.find((project) => project.id === projectId)
    return project ?? null
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
    throw new Error('Method not implemented.')
  }
}
