import { type IUpdateSubscriptionDTO } from '@modules/products/dtos/IUpdateSubscriptionDTO'

export interface IUpdatePerStripeSubscriptionId {
  stripeSubscriptionId: string
  data: IUpdateSubscriptionDTO
}
