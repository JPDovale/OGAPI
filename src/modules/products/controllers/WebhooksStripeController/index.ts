import { type Request, type Response } from 'express'
import type Stripe from 'stripe'
import { container } from 'tsyringe'

import { type ICheckoutSession } from '@modules/products/infra/repositories/entities/ICheckoutSession'
import { CheckoutSessionCompletedUseCase } from '@modules/products/useCases/CheckoutSessionCompletedUseCase'
import { GetEventWebhookUseCase } from '@modules/products/useCases/GetEventWebhookUseCase'
import { UpdateSubscriptionUseCase } from '@modules/products/useCases/UpdateSubscriptionUseCase'

import { RelevantEvents } from './types/IRelevantEvents'

export class WebhooksStripeController {
  async handle(req: Request, res: Response): Promise<Response> {
    const secret = req.headers['stripe-signature']

    const getEventWebhookUseCase = container.resolve(GetEventWebhookUseCase)
    const { event } = await getEventWebhookUseCase.execute({
      secret,
      request: req.body,
    })

    switch (event.type) {
      case RelevantEvents.checkoutSessionCompleted: {
        const checkoutSession = event.data.object as ICheckoutSession

        const checkoutSessionCompletedUseCase = container.resolve(
          CheckoutSessionCompletedUseCase,
        )

        await checkoutSessionCompletedUseCase.execute({
          customerId: checkoutSession.customer?.toString() ?? '',
          subscriptionId:
            checkoutSession.subscription?.toString() ??
            checkoutSession.payment_intent?.toString() ??
            '',
          expiresAt: checkoutSession.expires_at,
          mode: checkoutSession.mode.toString(),
          priceId: '',
        })

        break
      }

      case RelevantEvents.customerSubscriptionDeleted ||
        RelevantEvents.customerSubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription
        const customer = subscription.customer as string

        const updateSubscriptionUseCase = container.resolve(
          UpdateSubscriptionUseCase,
        )

        await updateSubscriptionUseCase.execute({
          customerId: customer,
          subscriptionId: subscription.id,
        })

        break
      }
      default:
        break
    }

    return res.status(200).json({ received: true })
  }
}
