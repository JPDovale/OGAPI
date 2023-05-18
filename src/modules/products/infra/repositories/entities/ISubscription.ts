import { type IUser } from '@modules/accounts/infra/repositories/entities/IUser'
import { type Subscription } from '@prisma/client'

export interface ISubscription extends Subscription {
  user?: IUser
}
