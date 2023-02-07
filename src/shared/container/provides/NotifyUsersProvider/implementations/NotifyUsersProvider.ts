import { inject, injectable } from 'tsyringe'

import { Notification } from '@modules/accounts/infra/mongoose/entities/Notification'
import { IUserMongo } from '@modules/accounts/infra/mongoose/entities/User'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { IProjectMongo } from '@modules/projects/infra/mongoose/entities/Project'

import { ICacheProvider } from '../../CacheProvider/ICacheProvider'
import { INotifyUsersProvider } from '../INotifyUsersProvider'

@injectable()
export class NotifyUsersProvider implements INotifyUsersProvider {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async notify(
    sendBy: IUserMongo,
    project: IProjectMongo,
    title: string,
    content: string,
  ): Promise<void> {
    const usersInProjectIds = await Promise.all(
      project.users.map(async (user) => {
        await this.cacheProvider.delete(`user-${user.id}`)
        return user.id
      }),
    )
    const usersIds = usersInProjectIds.filter((userId) => userId !== sendBy.id)

    const newNotification = new Notification({
      title,
      content,
      projectId: project.id,
      sendedPerUser: sendBy.id,
    })

    await this.usersRepository.updateNotificationManyById(
      usersIds,
      newNotification,
    )

    //   await Promise.all(
    //     project.users.map(async (u) => {
    //       if (u.id === sendBy.id) return
    //       const userToNotify = await this.usersRepository.findById(u.id)

    //       if (userToNotify) {
    //         const newNotification = new Notification({
    //           title,
    //           content,
    //           projectId: project.id,
    //           sendedPerUser: sendBy.id,
    //         })

    //         const notificationsUpdated = [
    //           newNotification,
    //           ...userToNotify.notifications,
    //         ]

    //         await this.usersRepository.updateNotifications(
    //           userToNotify.id,
    //           notificationsUpdated,
    //         )
    //       }
    //     }),
    //   )
  }
}
