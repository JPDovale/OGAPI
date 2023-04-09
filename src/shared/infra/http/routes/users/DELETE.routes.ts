import { Router } from 'express'

import { DeleteAvatarController } from '@modules/accounts/controllers/DeleteAvatarController'
import { DeleteUserController } from '@modules/accounts/controllers/DeleteUserController'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

export const userRoutesDelete = Router()

const deleteUserController = new DeleteUserController()
const deleteAvatarController = new DeleteAvatarController()

userRoutesDelete.use(ensureAuthenticated)
userRoutesDelete.delete('/', deleteUserController.handle)
userRoutesDelete.delete('/avatar', deleteAvatarController.handle)

userRoutesDelete.use(verifyIsAdmin)
userRoutesDelete.delete('/:id', deleteUserController.handle)
