import { type ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'

import { type IAvatar } from '../entities/Avatar'
import { type INotification } from '../entities/Notification'
import { type IUserMongo } from '../entities/User'

export interface IUsersRepository {
  findByEmail: (email: string) => Promise<IUserMongo | null | undefined>
  list: () => Promise<IUserMongo[]>
  create: (
    dataUserObj: ICreateUserDTO,
  ) => Promise<IUserMongo | null | undefined>
  findById: (userId: string) => Promise<IUserMongo | null | undefined>
  delete: (id: string) => Promise<void>
  updateAvatar: (
    userId: string,
    avatar: IAvatar,
  ) => Promise<IUserMongo | null | undefined>
  updateUser: (
    userId: string,
    username: string,
    name: string,
    email: string,
    age: string,
    sex: string,
  ) => Promise<IUserMongo | null | undefined>
  findByUsername: (username: string) => Promise<IUserMongo | null | undefined>
  findByCode: (code: string) => Promise<IUserMongo | null | undefined>
  getUser: (
    userId: string,
    updatedInfos: ICreateUserDTO,
  ) => Promise<IUserMongo | null | undefined>
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
