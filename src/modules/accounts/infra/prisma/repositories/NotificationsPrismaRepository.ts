import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type INotificationsRepository } from '../../repositories/contracts/INotificationRepository'

export class NotificationsPrismaRepository implements INotificationsRepository {
  async create(
    notification: Prisma.NotificationUncheckedCreateInput,
  ): Promise<void> {
    await prisma.notification.create({
      data: notification,
    })
  }
}
