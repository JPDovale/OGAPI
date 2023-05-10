import { Router } from 'express'

import { CreateUserController } from '@modules/accounts/controllers/CreateUserController'
import { NotifyAllUsersController } from '@modules/accounts/controllers/NotifyAllUsersController'
import { RecoveryPasswordController } from '@modules/accounts/controllers/RecoveryPasswordController'
import { SendForgotPasswordMailController } from '@modules/accounts/controllers/SendForgotPasswordMailController'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

export const userRoutesPost = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

const createUserController = new CreateUserController()
const sendForgotPasswordMailController = new SendForgotPasswordMailController()
const recoveryPasswordController = new RecoveryPasswordController()
const notifyAllUsersController = new NotifyAllUsersController()

// PATH: api/users
userRoutesPost.post('/', createUserController.handle)
userRoutesPost.post('/password/forgot', sendForgotPasswordMailController.handle)
userRoutesPost.post('/password/recovery', recoveryPasswordController.handle)

userRoutesPost.post(
  '/notify',
  ensureAuthenticated.verify,
  verifyIsAdmin,
  notifyAllUsersController.handle,
)
userRoutesPost.get(
  '/verify',
  ensureAuthenticated.verify,
  verifyIsAdmin,
  (req, res) => {
    return res.status(200).json({ admin: true })
  },
)
