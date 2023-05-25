import type Stripe from 'stripe'

export type IPaymentStatus = Stripe.Subscription.Status
export type IPaymentMode = 'subscription' | 'payment'
