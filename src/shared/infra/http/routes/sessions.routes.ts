import { Router } from 'express'

import { CreateSessionController } from '@modules/accounts/useCases/createSession/CreateSessionController'
import { LoginWithGoogleController } from '@modules/accounts/useCases/loginWithGoogle/LoginWithGoogleController'
import { RefreshTokenController } from '@modules/accounts/useCases/refreshToken/RefreshTokenController'

export const sessionsRoutes = Router()

const createSessionController = new CreateSessionController()
const refreshTokenController = new RefreshTokenController()
const loginWithGoogleController = new LoginWithGoogleController()

sessionsRoutes.post('/create', createSessionController.handle)

sessionsRoutes.post('/refresh', refreshTokenController.handle)

sessionsRoutes.post('/register/google', loginWithGoogleController.handle)
