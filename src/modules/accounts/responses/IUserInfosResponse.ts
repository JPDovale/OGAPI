import { type IAvatar } from '../infra/mongoose/entities/Avatar'
import { type INotification } from '../infra/mongoose/entities/Notification'

export interface IUserInfosResponse {
  id: string
  username: string
  email: string
  avatar?: IAvatar
  age: string
  sex: string
  createAt: string
  updateAt: string
  notifications: INotification[]
  isInitialized: boolean
  isSocialLogin: boolean
  name: string
  code?: string
}
