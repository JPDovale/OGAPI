import { Router } from 'express'

import { DeleteAvatarController } from '@modules/accounts/controllers/DeleteAvatarController'
import { DeleteUserController } from '@modules/accounts/controllers/DeleteUserController'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

export const userRoutesDelete = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

const deleteUserController = new DeleteUserController()
const deleteAvatarController = new DeleteAvatarController()

// PATH: api/users

userRoutesDelete.delete(
  '/',
  ensureAuthenticated.verify,
  deleteUserController.handle,
)
userRoutesDelete.delete(
  '/avatar',
  ensureAuthenticated.verify,
  deleteAvatarController.handle,
)

userRoutesDelete.delete(
  '/:id',
  ensureAuthenticated.verify,
  verifyIsAdmin,
  deleteUserController.handle,
)
