import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class DeleteProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(projectId: string, userId: string): Promise<void> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new AppError('O projeto não existe', 404)
    }

    if (project.createdPerUser !== userId) {
      throw new AppError('Você não tem permissão para deletar o projeto', 401)
    }

    await this.projectsRepository.delete(projectId)
  }
}
