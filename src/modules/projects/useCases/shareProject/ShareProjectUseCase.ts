import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { AppError } from '@shared/errors/AppError'
import { makeErrorProjectAlreadySharadWithUser } from '@shared/errors/projects/makeErrorProjectAlreadySharadWithUser'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorLimitFreeInEnd } from '@shared/errors/useFull/makeErrorLimitFreeInEnd'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IUserRequest {
  email: string
  permission: string
}

type IPermission = 'view' | 'edit' | 'comment'

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

    if (!project) throw makeErrorProjectNotFound()

    const thisProjectAreFromUser = project.createdPerUser === userId
    const userCreatorOfProject = await this.usersRepository.findById(
      project.createdPerUser,
    )

    if (!thisProjectAreFromUser || !userCreatorOfProject)
      throw makeErrorDeniedPermission()

    if (project.users.length >= 5) throw makeErrorLimitFreeInEnd()

    const isShared = project.users.find((u) => u.email === userToShare.email)

    if (isShared) throw makeErrorProjectAlreadySharadWithUser()

    const userExist = await this.usersRepository.findByEmail(userToShare.email)

    if (!userExist) throw makeErrorUserNotFound()

    const isValidPermission =
      userToShare.permission === 'edit' ??
      userToShare.permission === 'view' ??
      userToShare.permission === 'comment'

    if (!isValidPermission) {
      throw new AppError({
        title: 'Informações inválidas',
        message:
          'As informações fornecidas não são aceitas pela aplicação. Rastreamos o erro no seu dispositivo e resolveremos em breve',
        statusCode: 401,
      })
    }

    const addUser = {
      email: userExist.email,
      id: userExist.id,
      permission: userToShare.permission as IPermission,
    }

    const usersAdded = [...project.users, addUser]

    const updatedProject = await this.projectsRepository.addUsers(
      usersAdded,
      projectId,
    )

    if (!updatedProject) throw makeErrorProjectNotUpdate()

    const newNotification = new Notification({
      title: 'Projeto compartilhado',
      content: `${userCreatorOfProject.name} acabou de compartilhar o projeto "${project.name}" com você. Acesse os projetos compartilhados para ver.`,
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

    return updatedProject
  }
}
