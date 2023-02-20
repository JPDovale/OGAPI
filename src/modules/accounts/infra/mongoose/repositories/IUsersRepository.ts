import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'

import { IAvatar } from '../entities/Avatar'
import { INotification } from '../entities/Notification'
import { IUserMongo } from '../entities/User'

export interface IUsersRepository {
  findByEmail: (email: string) => Promise<IUserMongo>
  list: () => Promise<IUserMongo[]>
  create: (dataUserObj: ICreateUserDTO) => Promise<IUserMongo>
  findById: (userId: string) => Promise<IUserMongo>
  delete: (id: string) => Promise<void>
  updateAvatar: (userId: string, avatar: IAvatar) => Promise<IUserMongo>
  updateUser: (
    userId: string,
    username: string,
    name: string,
    email: string,
    age: string,
    sex: string,
  ) => Promise<IUserMongo>
  findByUsername: (username: string) => Promise<IUserMongo>
  findByCode: (code: string) => Promise<IUserMongo>
  getUser: (userId: string, updatedInfos: ICreateUserDTO) => Promise<IUserMongo>
  updateNotifications: (
    userId: string,
    notifications: INotification[],
  ) => Promise<void>
  updatePassword: (userId: string, password: string) => Promise<void>
  findManyById: (ids: string[]) => Promise<IUserMongo[]>
  updateNotificationManyById: (
    ids: string[],
    notification: INotification,
  ) => Promise<void>
}