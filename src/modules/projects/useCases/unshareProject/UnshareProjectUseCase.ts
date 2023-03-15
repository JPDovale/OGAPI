import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUsersRepository } from '@modules/accounts/infra/mongoose/repositories/IUsersRepository'
import { type IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'
import { IProjectsRepository } from '@modules/projects/repositories/IProjectRepository'
import { makeErrorProjectAlreadyUnsharedWhitUser } from '@shared/errors/projects/makeErrorProjectAlreadyUnsharedWhitUser'
import { makeErrorProjectNotFound } from '@shared/errors/projects/makeErrorProjectNotFound'
import { makeErrorProjectNotUpdate } from '@shared/errors/projects/makeErrorProjectNotUpdate'
import { makeErrorDeniedPermission } from '@shared/errors/useFull/makeErrorDeniedPermission'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

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

    if (!project) throw makeErrorProjectNotFound()
    if (!user) throw makeErrorUserNotFound()

    const thisProjectAreFromUser = project.createdPerUser === userId

    if (!thisProjectAreFromUser) throw makeErrorDeniedPermission()

    const isShared = project.users.find((u) => u.email === userEmail)

    if (!isShared) throw makeErrorProjectAlreadyUnsharedWhitUser()

    const usersAccessUpdate = project.users.filter((u) => u.email !== userEmail)

    const projectUpdated = await this.projectsRepository.addUsers(
      usersAccessUpdate,
      projectId,
    )

    if (!projectUpdated) throw makeErrorProjectNotUpdate()

    const userExist = await this.usersRepository.findByEmail(userEmail)

    if (userExist) {
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
    }

    return projectUpdated
  }
}
