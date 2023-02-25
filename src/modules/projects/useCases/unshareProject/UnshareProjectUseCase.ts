import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

@injectable()
export class UnshareProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    userEmail: string,
    projectId: string,
    userId: string,
  ): Promise<IProjectMongo> {
    const project = await this.projectsRepository.findById(projectId)
    const user = await this.usersRepository.findById(userId)

    if (!project) {
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })
    }

    const thisProjectAreFromUser = project.createdPerUser === userId

    if (!thisProjectAreFromUser) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Você não tem permissão para alterar o projeto.',
        statusCode: 401,
      })
    }

    const isShared = project.users.find((u) => u.email === userEmail)

    if (!isShared)
      throw new AppError({
        title: 'Esse usuário não tem acesso ao projeto...',
        message:
          'Você está tentando remover um usuário que não tem acesso ao projeto...',
      })

    const usersAccessUpdate = project.users.filter((u) => u.email !== userEmail)
    const response = await this.projectsRepository.addUsers(
      usersAccessUpdate,
      projectId,
    )

    const userExist = await this.usersRepository.findByEmail(userEmail)

    const newNotification = new Notification({
      title: `Você foi removido do projeto ${project.name}`,
      content: `${user.name} acabou de remover você do projeto "${project.name}".`,
      projectId,
      sendedPerUser: userId,
    })

    const notificationsUpdated = [
      { ...newNotification },
      ...userExist.notifications,
    ]

    await this.usersRepository.updateNotifications(
      userExist.id,
      notificationsUpdated,
    )

    return response
  }
}
