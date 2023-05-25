import { type INotification } from '@modules/accounts/infra/repositories/entities/INotification'
import {
  type IPaymentMode,
  type IPaymentStatus,
} from '@modules/products/infra/repositories/types/IPaymentStatus'

export interface IUserResponse {
  infos: {
    username: string
    email: string
    age: string
    sex: string
    name: string
    avatar: {
      alt: string
      url: string | undefined
    }
    createdAt: Date
  }
  account: {
    id: string
    isSocialLogin: boolean
    notification: {
      numberNew: number
      notifications: INotification[]
    }
    subscription: {
      id: string
      status: IPaymentStatus
      expiresAt: Date | null
      mode: IPaymentMode
    } | null
  }
}
