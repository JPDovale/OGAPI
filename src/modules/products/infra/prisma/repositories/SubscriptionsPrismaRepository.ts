import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type ISubscriptionsRepository } from '../../repositories/contracts/ISubscriptionsRepository'
import { type ISubscription } from '../../repositories/entities/ISubscription'
import { type IUpdatePerStripeSubscriptionId } from '../../repositories/types/IUpdatePerStripeSubscriptionId'

export class SubscriptionsPrismaRepository implements ISubscriptionsRepository {
  async create(
    data: Prisma.SubscriptionUncheckedCreateInput,
  ): Promise<ISubscription | null> {
    const subscription = await prisma.subscription.create({
      data,
    })

    return subscription
  }

  async updatePerStripeSubscriptionId({
    data,
    stripeSubscriptionId,
  }: IUpdatePerStripeSubscriptionId): Promise<ISubscription | null> {
    const subscription = await prisma.subscription.update({
      where: {
        subscription_stripe_id: stripeSubscriptionId,
      },
      data,
    })

    return subscription
  }

  async delete(subscriptionId: string): Promise<void> {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    })
  }
}
