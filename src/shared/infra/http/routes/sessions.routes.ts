import { Router } from 'express'

import { CreateSessionController } from '@modules/accounts/useCases/createSession/CreateSessionController'
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController'

import { RateLimiter } from '../middlewares/limiter'

export const sessionsRoutes = Router()

const createSessionController = new CreateSessionController()
const refreshTokenController = new RefreshTokenController()

const rateLimiterToCreateSession = new RateLimiter(2, 'minutes')
const rateLimiterToRefreshToken = new RateLimiter(1, 'hours')

sessionsRoutes.post(
  '/create',
  // rateLimiterToCreateSession.rete,
  createSessionController.handle,
)
sessionsRoutes.post(
  '/refresh',
  // rateLimiterToRefreshToken.rete,
  refreshTokenController.handle,
)
