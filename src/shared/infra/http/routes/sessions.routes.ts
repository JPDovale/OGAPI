import { Router } from 'express'

import { CreateSessionController } from '@modules/accounts/useCases/createSession/CreateSessionController'
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController'

export const sessionsRoutes = Router()

const createSessionController = new CreateSessionController()
const refreshTokenController = new RefreshTokenController()

sessionsRoutes.post('/create', createSessionController.handle)

sessionsRoutes.post('/refresh', refreshTokenController.handle)
