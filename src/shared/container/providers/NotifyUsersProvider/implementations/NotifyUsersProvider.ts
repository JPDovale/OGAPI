import { inject, injectable } from 'tsyringe'

import { INotificationsRepository } from '@modules/accounts/infra/repositories/contracts/INotificationRepository'
import { IUsersRepository } from '@modules/accounts/infra/repositories/contracts/IUsersRepository'
import InjectableDependencies from '@shared/container/types'

import {
  type INotifyUsersInOneProject,
  type INotifyAll,
  type INotifyUsersProvider,
  type INotifyOneUser,
} from '../INotifyUsersProvider'

@injectable()
export class NotifyUsersProvider implements INotifyUsersProvider {
  constructor(
    @inject(InjectableDependencies.Repositories.UsersRepository)
    private readonly usersRepository: IUsersRepository,

    @inject(InjectableDependencies.Repositories.NotificationsRepository)
    private readonly notificationsRepository: INotificationsRepository,
  ) {}

  async notifyUsersInOneProject({
    content,
    project,
    title,
  }: INotifyUsersInOneProject): Promise<void> {
    const usersWithPermissionToComment =
      project.users_with_access_comment?.users ?? []
    const usersWithPermissionToEdit =
      project.users_with_access_edit?.users ?? []
    const usersWithPermissionToView =
      project.users_with_access_view?.users ?? []

    const usersToNotify = [
      ...usersWithPermissionToComment,
      ...usersWithPermissionToEdit,
      ...usersWithPermissionToView,
    ]

    const usersToConnectIn = usersToNotify.map((user) => {
      return {
        id: user.id,
      }
    })

    usersToConnectIn.push({
      id: project.user!.id,
    })

    await this.notificationsRepository.create({
      title,
      content,
      usersNotified: {
        connect: usersToConnectIn,
      },
    })

    Promise.all(
      usersToConnectIn.map(async (user) => {
        await this.usersRepository.updateUser({
          userId: user.id,
          data: {
            new_notifications: {
              increment: 1,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })
  }

  async notifyAll({ content, title }: INotifyAll): Promise<void> {
    const usersToNotify = await this.usersRepository.listAllIds()

    await this.notificationsRepository.create({
      title,
      content,
      usersNotified: {
        connect: usersToNotify,
      },
    })

    Promise.all(
      usersToNotify.map(async (user) => {
        await this.usersRepository.updateUser({
          userId: user.id,
          data: {
            new_notifications: {
              increment: 1,
            },
          },
        })
      }),
    ).catch((err) => {
      throw err
    })
  }

  async notifyOneUser({
    content,
    title,
    userToNotifyId,
  }: INotifyOneUser): Promise<void> {
    await this.notificationsRepository.create({
      title,
      content,
      usersNotified: {
        connect: {
          id: userToNotifyId,
        },
      },
    })

    await this.usersRepository.updateUser({
      userId: userToNotifyId,
      data: {
        new_notifications: {
          increment: 1,
        },
      },
    })
  }
}
