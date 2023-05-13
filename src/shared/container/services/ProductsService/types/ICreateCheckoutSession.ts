export interface ICreateCheckoutSession {
  priceId: string
  customerId: string
  mode: 'subscription' | 'payment'
}
