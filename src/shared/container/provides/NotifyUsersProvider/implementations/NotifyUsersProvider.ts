import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'

import { INotifyUsersProvider } from '../INotifyUsersProvider'

@injectable()
export class NotifyUsersProvider implements INotifyUsersProvider {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async notify(
    sendBy: IUserMongo,
    project: IProjectMongo,
    title: string,
    content: string,
  ): Promise<void> {
    await Promise.all(
      project.users.map(async (u) => {
        if (u.id === sendBy.id) return
        const userToNotify = await this.usersRepository.findById(u.id)

        if (userToNotify) {
          const newNotification = new Notification({
            title,
            content,
            projectId: project.id,
            sendedPerUser: sendBy.id,
          })

          const notificationsUpdated = [
            newNotification,
            ...userToNotify.notifications,
          ]

          await this.usersRepository.updateNotifications(
            userToNotify.id,
            notificationsUpdated,
          )
        }
      }),
    )
  }
}
