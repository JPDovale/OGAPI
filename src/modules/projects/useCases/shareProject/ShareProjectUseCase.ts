import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'

interface IUserRequest {
  email: string
  permission: 'view' | 'edit' | 'comment'
}

@injectable()
export class ShareProjectUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('ProjectsRepository')
    private readonly projectsRepository: IProjectsRepository,
  ) {}

  async execute(
    userToShare: IUserRequest,
    projectId: string,
    userId: string,
  ): Promise<IProjectMongo> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project)
      throw new AppError({
        title: 'Projeto não encontrado.',
        message: 'Parece que esse projeto não existe na nossa base de dados...',
        statusCode: 404,
      })

    const thisProjectAreFromUser = project.createdPerUser === userId

    if (!thisProjectAreFromUser) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Você não tem permissão para alterar o projeto.',
        statusCode: 401,
      })
    }

    if (project.users.length >= 5) {
      throw new AppError({
        title: 'Limite de compartilhamento',
        message:
          'Você pode compartilhar o projeto com apenas 5 pessoas ao mesmo tempo.',
      })
    }

    const userCreatorOfProject = await this.usersRepository.findById(
      project.createdPerUser,
    )

    const isShared = project.users.find((u) => u.email === userToShare.email)

    if (isShared)
      throw new AppError({
        title: 'Esse usuário já tem acesso ao projeto...',
        message:
          'Você está tentando adicionar um usuário que já tem acesso ao projeto... Caso queira alterar a permissão, vá até as configurações do projeto.',
      })

    const userExist = await this.usersRepository.findByEmail(userToShare.email)

    if (!userExist)
      throw new AppError({
        title: 'Usuário não encontrado.',
        message: 'Parece que esse usuário não existe na nossa base de dados...',
        statusCode: 404,
      })

    const addUser = {
      email: userExist.email,
      id: userExist.id,
      permission: userToShare.permission,
    }

    const usersAdded = [...project.users, addUser]

    const updatedProject = await this.projectsRepository.addUsers(
      usersAdded,
      projectId,
    )

    const newNotification = new Notification({
      title: 'Projeto compartilhado',
      content: `${userCreatorOfProject.name} acabou de compartilhar o projeto "${project.name}" com você. Acesse os projetos compartilhados para ver.`,
      projectId,
      sendedPerUser: userId,
    })

    const notificationsUpdated = [newNotification, ...userExist.notifications]

    await this.usersRepository.updateNotifications(
      userExist.id,
      notificationsUpdated,
    )

    return updatedProject
  }
}
