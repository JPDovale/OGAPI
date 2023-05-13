import type Stripe from 'stripe'

import { type ICheckoutSession } from '@modules/products/infra/repositories/entities/ICheckoutSession'
import { type ICustomer } from '@modules/products/infra/repositories/entities/ICustomer'
import { type IEvent } from '@modules/products/infra/repositories/entities/IEvent'
import { type IPrice } from '@modules/products/infra/repositories/entities/IPrice'

import { type ICreateCheckoutSession } from './types/ICreateCheckoutSession'
import { type ICreateCustomer } from './types/ICreateCustomer'

export abstract class IProductsService {
  abstract getPrices(): Promise<IPrice[]>
  abstract createCheckoutSession(
    checkout: ICreateCheckoutSession,
  ): Promise<ICheckoutSession>
  abstract createCustomer({ email }: ICreateCustomer): Promise<ICustomer>
  abstract getPrice(priceId: string): Promise<IPrice>
  abstract getEvent(
    secret: string | string[] | undefined,
    request: Buffer | string,
  ): Promise<IEvent>
  abstract getSubscription(subscriptionId: string): Promise<Stripe.Subscription>
}
