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
userRoutesDelete.use(ensureAuthenticated.verify)
userRoutesDelete.delete('/', deleteUserController.handle)
userRoutesDelete.delete('/avatar', deleteAvatarController.handle)

userRoutesDelete.delete('/:id', verifyIsAdmin, deleteUserController.handle)
