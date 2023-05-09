import { randomUUID } from 'node:crypto'

import { type ICreateNotificationDTO } from '@modules/accounts/dtos/ICreateNotificationDTO'

import { type INotificationsRepository } from '../contracts/INotificationRepository'
import { type INotification } from '../entities/INotification'

export class NotificationsRepositoryInMemory
  implements INotificationsRepository
{
  notifications: INotification[] = []

  async create(notification: ICreateNotificationDTO): Promise<void> {
    const newNotification = {
      created_at: new Date(),
      content: notification.content,
      id: randomUUID(),
      visualized_at: null,
      title: notification.title,
    }

    this.notifications.push(newNotification)
  }

}
