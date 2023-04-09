import { Router } from 'express'

import { CreateSessionController } from '@modules/accounts/controllers/CreateSessionController'
import { RefreshTokenController } from '@modules/accounts/controllers/RefreshTokenController'

export const sessionsRoutesPost = Router()

const createSessionController = new CreateSessionController()
const refreshTokenController = new RefreshTokenController()

sessionsRoutesPost.post('/create', createSessionController.handle)
sessionsRoutesPost.post('/refresh', refreshTokenController.handle)
