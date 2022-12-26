import { inject, injectable } from 'tsyringe'

import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'

@injectable()
export class ListProjectsPerUserUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(userId: string): Promise<IProjectMongo[]> {
    const projectsThisUser = await this.projectsRepository.listPerUser(userId)

    return projectsThisUser
  }
}
