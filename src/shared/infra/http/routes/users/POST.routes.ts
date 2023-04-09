import { Router } from 'express'

import { CreateUserController } from '@modules/accounts/controllers/CreateUserController'
import { NotifyAllUsersController } from '@modules/accounts/controllers/NotifyAllUsersController'
import { RecoveryPasswordController } from '@modules/accounts/controllers/RecoveryPasswordController'
import { SendForgotPasswordMailController } from '@modules/accounts/controllers/SendForgotPasswordMailController'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

export const userRoutesPost = Router()

const createUserController = new CreateUserController()
const sendForgotPasswordMailController = new SendForgotPasswordMailController()
const recoveryPasswordController = new RecoveryPasswordController()
const notifyAllUsersController = new NotifyAllUsersController()

userRoutesPost.post('/', createUserController.handle)
userRoutesPost.post('/password/forgot', sendForgotPasswordMailController.handle)
userRoutesPost.post('/password/recovery', recoveryPasswordController.handle)

userRoutesPost.use(ensureAuthenticated)
userRoutesPost.use(verifyIsAdmin)
userRoutesPost.post('/notify', notifyAllUsersController.handle)
userRoutesPost.get('/verify', (req, res) => {
  return res.status(200).json({ admin: true })
})
