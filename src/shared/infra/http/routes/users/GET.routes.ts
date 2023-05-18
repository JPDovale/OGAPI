import { Router } from 'express'

import { GetInfosController } from '@modules/accounts/controllers/GetInfosController'
import { ListUsersController } from '@modules/accounts/controllers/ListUsersController'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

export const userRoutesGet = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

const getInfosController = new GetInfosController()
const listUsersController = new ListUsersController()

// PATH: api/users
userRoutesGet.get('/', ensureAuthenticated.verify, getInfosController.handle)

userRoutesGet.get(
  '/many',
  ensureAuthenticated.verify,
  verifyIsAdmin,
  listUsersController.handle,
)
