import { Router } from 'express'

import { CreateSessionAdminController } from '@modules/accounts/controllers/CreateSessionAdminController'
import { CreateSessionController } from '@modules/accounts/controllers/CreateSessionController'
import { RefreshTokenController } from '@modules/accounts/controllers/RefreshTokenController'

export const sessionsRoutesPost = Router()

const createSessionController = new CreateSessionController()
const createSessionAdminController = new CreateSessionAdminController()
const refreshTokenController = new RefreshTokenController()

// PATH: api/sessions
sessionsRoutesPost.post('/', createSessionController.handle)
sessionsRoutesPost.post('/admin', createSessionAdminController.handle)
sessionsRoutesPost.post('/refresh', refreshTokenController.handle)
