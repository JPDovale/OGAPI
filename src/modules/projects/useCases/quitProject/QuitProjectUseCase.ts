import { inject, injectable } from 'tsyringe'

import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
}

@injectable()
export class QuitProjectUseCase {
  constructor(
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute({ userId, projectId }: IRequest): Promise<void> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    const isShared = project.users.find((u) => u.id === userId)

    if (!isShared) {
      throw new AppError({
        title: 'Você não tem mais acesso a esse projeto...',
        message: 'Você está tentando sair de um projeto que não tem acesso...',
      })
    }

    const usersAccessUpdate = project.users.filter((u) => u.id !== userId)
    await this.projectsRepository.addUsers(usersAccessUpdate, projectId)
  }
}
