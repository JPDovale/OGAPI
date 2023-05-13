export enum RelevantEvents {
  'checkoutSessionCompleted' = 'checkout.session.completed',
  'customerSubscriptionUpdated' = 'customer.subscription.updated',
  'customerSubscriptionDeleted' = 'customer.subscription.deleted',
}

export type IRelevantEvents = keyof typeof RelevantEvents
