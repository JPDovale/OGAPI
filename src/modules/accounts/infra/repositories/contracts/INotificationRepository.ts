import { type ICreateNotificationDTO } from '@modules/accounts/dtos/ICreateNotificationDTO'

export abstract class INotificationsRepository {
  abstract create(notification: ICreateNotificationDTO): Promise<void>
}
