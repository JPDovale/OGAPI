import bodyParser from 'body-parser'
import { Router } from 'express'

import { CreateCheckoutSessionController } from '@modules/products/controllers/CreateCheckoutSessionController'
import { WebhooksStripeController } from '@modules/products/controllers/WebhooksStripeController'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'

export const productsRoutesPost = Router()

const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

const createCheckoutSessionController = new CreateCheckoutSessionController()
const webhooksStripeController = new WebhooksStripeController()

productsRoutesPost.post(
  '/prices/:priceId/checkout/sessions',
  ensureAuthenticatedMiddleware.verify,
  createCheckoutSessionController.handle,
)
productsRoutesPost.post(
  '/stripe/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  webhooksStripeController.handle,
)
// won-easier-fervid-clear
