import { type User } from '@prisma/client'

import { type INotification } from './INotification'

export interface IUser extends User {
  notifications?: INotification[]
  _count?: {
    projects?: number
    notifications?: number
    boxes?: number
    books?: number
  }
}
