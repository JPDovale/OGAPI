import { Router } from 'express'

import { AvatarUpdateController } from '@modules/accounts/controllers/AvatarUpdateController'
import { LogoutController } from '@modules/accounts/controllers/LogoutController'
import { PasswordUpdateController } from '@modules/accounts/controllers/PasswordUpdateController'
import { UserUpdateController } from '@modules/accounts/controllers/UserUpdateController'
import { VisualizeNotificationsController } from '@modules/accounts/controllers/VisualizeNotificationsController'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { Uploads } from '../../middlewares/upload'

export const userRoutesPatch = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

const logoutController = new LogoutController()
const avatarUpdateController = new AvatarUpdateController()
const userUpdateController = new UserUpdateController()
const passwordUpdateController = new PasswordUpdateController()
const visualizeNotificationsController = new VisualizeNotificationsController()

const uploads = new Uploads('avatar', 'image')

// PATH: api/users
userRoutesPatch.use(ensureAuthenticated.verify)
userRoutesPatch.patch('/logout', logoutController.handle)
userRoutesPatch.patch(
  '/avatar-update',
  uploads.upload.single('file'),
  avatarUpdateController.handle,
)
userRoutesPatch.patch('/', userUpdateController.handle)
userRoutesPatch.patch('/password', passwordUpdateController.handle)
userRoutesPatch.patch(
  '/notifications/visualize',
  visualizeNotificationsController.handle,
)
