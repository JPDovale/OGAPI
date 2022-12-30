import { ICreateUserDTO } from '../dtos/ICreateUserDTO'
import { INotification } from '../infra/mongoose/entities/Notification'
import { IUserMongo } from '../infra/mongoose/entities/User'

export interface IUsersRepository {
  findByEmail: (email: string) => Promise<IUserMongo>
  list: () => Promise<IUserMongo[]>
  create: (dataUserObj: ICreateUserDTO) => Promise<IUserMongo>
  findById: (userId: string) => Promise<IUserMongo>
  delete: (id: string) => Promise<void>
  updateAvatar: (userId: string, url: string) => Promise<void>
  updateUsername: (userId: string, username: string) => Promise<void>
  findByUsername: (username: string) => Promise<IUserMongo>
  findByCode: (code: string) => Promise<IUserMongo>
  getUser: (userId: string, updatedInfos: ICreateUserDTO) => Promise<IUserMongo>
  updateNotifications: (
    userId: string,
    notifications: INotification[],
  ) => Promise<void>
}
