import { type INotification } from '../infra/repositories/entities/INotification'

export interface IUserInfosResponse {
  id: string
  username: string
  email: string
  avatar_filename: string | null
  avatar_url: string | null
  age: string
  sex: string
  created_at: Date
  notifications: INotification[]
  is_social_login: boolean
  name: string
  new_notifications: number
}
