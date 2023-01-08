import { IAvatar } from '../infra/mongoose/entities/Avatar'
import { INotification } from '../infra/mongoose/entities/Notification'

export interface IUserInfosResponse {
  id: string
  username: string
  email: string
  avatar: IAvatar
  age: string
  sex: string
  createAt: string
  updateAt: string
  notifications: INotification[]
  isInitialized: boolean
  name: string
}
