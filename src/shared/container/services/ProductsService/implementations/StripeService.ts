import Stripe from 'stripe'

import { env } from '@env/index'
import { type ICheckoutSession } from '@modules/products/infra/repositories/entities/ICheckoutSession'
import { type ICustomer } from '@modules/products/infra/repositories/entities/ICustomer'
import { type IPrice } from '@modules/products/infra/repositories/entities/IPrice'

import { type IProductsService } from '../IProductsService'
import { type ICreateCheckoutSession } from '../types/ICreateCheckoutSession'
import { type ICreateCustomer } from '../types/ICreateCustomer'

export class StripeService implements IProductsService {
  private readonly stripeApi: Stripe

  constructor() {
    const stripeApi = new Stripe(env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
      appInfo: {
        name: 'OG-api',
        version: '1.0.0',
      },
    })

    this.stripeApi = stripeApi
  }

  async getPrices(): Promise<Stripe.Price[]> {
    const prices = await this.stripeApi.prices.list()

    return prices.data
  }

  async createCheckoutSession({
    customerId,
    mode,
    priceId,
  }: ICreateCheckoutSession): Promise<ICheckoutSession> {
    const checkoutSession = await this.stripeApi.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      allow_promotion_codes: true,
      success_url: env.STRIPE_SUCCESS_URL,
      cancel_url: env.STRIPE_CANCEL_URL,
    })

    return checkoutSession
  }

  async createCustomer({ email }: ICreateCustomer): Promise<ICustomer> {
    const customer = await this.stripeApi.customers.create({
      email,
    })

    return customer
  }

  async getPrice(priceId: string): Promise<IPrice> {
    const price = await this.stripeApi.prices.retrieve(priceId)

    return price
  }

  async getEvent(
    secret: string | string[],
    request: Buffer | string,
  ): Promise<Stripe.Event> {
    let event: Stripe.Event

    // eslint-disable-next-line no-useless-catch
    try {
      event = this.stripeApi.webhooks.constructEvent(
        request,
        secret,
        env.STRIPE_WEBHOOK_SECRET,
      )
    } catch (err) {
      throw err
    }

    return event
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripeApi.subscriptions.retrieve(
      subscriptionId,
    )

    return subscription
  }
}
