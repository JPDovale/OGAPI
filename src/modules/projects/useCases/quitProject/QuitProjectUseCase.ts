import { inject, injectable } from 'tsyringe'

import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { INotifyUsersProvider } from '@shared/container/provides/NotifyUsersProvider/INotifyUsersProvider'
import { AppError } from '@shared/errors/AppError'

interface IRequest {
  userId: string
  projectId: string
}

@injectable()
export class QuitProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
    @inject('NotifyUsersProvider')
    private readonly notifyUsersProvider: INotifyUsersProvider,
  ) {}

  async execute({ userId, projectId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    if (!user) {
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    if (userId === project.createdPerUser) {
      throw new AppError({
        title: 'Você não pode sair do projeto',
        message:
          'Você esta tentando sair de um projeto o qual você criou... Tente exclui-lo',
        statusCode: 409,
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

    await this.notifyUsersProvider.notify(
      user,
      project,
      `${user.username} saiu do projeto.`,
      `${user.username} acabou de sair do projeto ${project.name}`,
    )
  }
}
