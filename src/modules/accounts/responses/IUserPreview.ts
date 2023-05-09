import { type INotification } from '../infra/repositories/entities/INotification'

export interface IUserPreview {
  email: string
  id: string
  avatar_url: string | null
  notifications?: INotification[]
  new_notifications: number
  username: string
}
