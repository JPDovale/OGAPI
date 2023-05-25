import { type ISubscription } from '@modules/products/infra/repositories/entities/ISubscription'

import { type INotification } from '../../infra/repositories/entities/INotification'

export interface IUserPreview {
  email: string
  id: string
  avatar_url: string | null
  notifications?: INotification[]
  new_notifications: number
  username: string
  subscription?: ISubscription | null
}
