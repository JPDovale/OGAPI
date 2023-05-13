import { type ISubscription } from '@modules/products/infra/repositories/entities/ISubscription'
import { type User } from '@prisma/client'

import { type INotification } from './INotification'

export interface IUser extends User {
  notifications?: INotification[]
  subscription?: ISubscription | null
  _count?: {
    projects?: number
    notifications?: number
    boxes?: number
    books?: number
  }
}
