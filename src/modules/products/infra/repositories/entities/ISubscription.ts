import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type Subscription } from '@prisma/client'

import { type IPaymentStatus } from '../types/IPaymentStatus'

export interface ISubscription extends Subscription {
  user?: IUser
  payment_status: IPaymentStatus
}
