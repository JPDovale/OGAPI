import { type ICreateSubscriptionDTO } from '@modules/products/dtos/ICreateSubscriptionDTO'

import { type ISubscription } from '../entities/ISubscription'
import { type IUpdatePerStripeSubscriptionId } from '../types/IUpdatePerStripeSubscriptionId'

export abstract class ISubscriptionsRepository {
  abstract create(data: ICreateSubscriptionDTO): Promise<ISubscription | null>
  abstract updatePerStripeSubscriptionId(
    data: IUpdatePerStripeSubscriptionId,
  ): Promise<ISubscription | null>
  abstract delete(subscriptionId: string): Promise<void>
}
