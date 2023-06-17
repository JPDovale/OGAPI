import { Router } from 'express'

import { CreateOAuthAccountController } from '@modules/accounts/controllers/CreateOAuthAccountController'
import { CreateOAuthSessionController } from '@modules/accounts/controllers/CreateOAuthSessionController'
import { CreateSessionAdminController } from '@modules/accounts/controllers/CreateSessionAdminController'
import { CreateSessionController } from '@modules/accounts/controllers/CreateSessionController'
import { CreateUserOAuthController } from '@modules/accounts/controllers/CreateUserOAuthController'
import { GetByAccountUserController } from '@modules/accounts/controllers/GetByAccountUserController'
import { GetByEmailUserController } from '@modules/accounts/controllers/GetByEmailUserController'
import { GetSessionAndUserController } from '@modules/accounts/controllers/GetSessionAndUserController'
import { GetUserController } from '@modules/accounts/controllers/GetUserController'
import { RefreshTokenController } from '@modules/accounts/controllers/RefreshTokenController'
import { UpdateSessionController } from '@modules/accounts/controllers/UpdateSessionController'
import { UserOAuthUpdateController } from '@modules/accounts/controllers/UserOAuthUpdateController'

import { VerifyApiKey } from '../../middlewares/verifyApiKey'

export const sessionsRoutes = Router()

const verifyApiKey = new VerifyApiKey()

const createSessionController = new CreateSessionController()
const createSessionAdminController = new CreateSessionAdminController()
const refreshTokenController = new RefreshTokenController()
const userOAuthUpdateController = new UserOAuthUpdateController()

// POST: api/sessions
sessionsRoutes.post('/', createSessionController.handle)
sessionsRoutes.post('/admin', createSessionAdminController.handle)
sessionsRoutes.post('/refresh', refreshTokenController.handle)

// Secret api key is required
const getUserController = new GetUserController()
const getSessionAndUserController = new GetSessionAndUserController()
const getByEmailUserController = new GetByEmailUserController()
const getByAccountUserController = new GetByAccountUserController()
const createOAuthAccountController = new CreateOAuthAccountController()
const createOAuthSessionController = new CreateOAuthSessionController()
const createUserOAuthController = new CreateUserOAuthController()
const updateSessionController = new UpdateSessionController()

sessionsRoutes.use(verifyApiKey.verifyPrivate)

// GET: api/sessions
sessionsRoutes.get('/oauth/users/:id', getUserController.handle)
sessionsRoutes.get('/oauth/users/email/:email', getByEmailUserController.handle)
sessionsRoutes.get(
  '/oauth/users/provider/:provider/:providerAccountId',
  getByAccountUserController.handle,
)
sessionsRoutes.get(
  '/oauth/sessions/:sessionToken/users',
  getSessionAndUserController.handle,
)

// PUT: api/sessions
sessionsRoutes.put('/oauth/users/:id', userOAuthUpdateController.handle)
sessionsRoutes.put(
  '/oauth/sessions/:sessionToken',
  updateSessionController.handle,
)

// POST: api/sessions
sessionsRoutes.post('/oauth/accounts', createOAuthAccountController.handle)
sessionsRoutes.post('/oauth/session', createOAuthSessionController.handle)
sessionsRoutes.post('/oauth/users', createUserOAuthController.handle)
