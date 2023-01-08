import { Router } from 'express'

import { AvatarUpdateController } from '@modules/accounts/useCases/avatarUpdate/AvatarUpdateController'
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController'
import { CreateUserPerAdminController } from '@modules/accounts/useCases/createUserPerAdmin/CreateUserPerAdminController'
import { DeleteUserController } from '@modules/accounts/useCases/deleteUser/DeleteUserController'
import { GetInfosController } from '@modules/accounts/useCases/getInfos/GetInfosController'
import { GetUserPerCodeController } from '@modules/accounts/useCases/getUserPerCode/GetUserPerCodeController'
import { ListUsersController } from '@modules/accounts/useCases/listUsers/ListUsersController'
import { PasswordUpdateController } from '@modules/accounts/useCases/passwordUpdate/PasswordUpdateController'
import { UserUpdateController } from '@modules/accounts/useCases/userUpdate/UserUpdateController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { Uploads } from '../middlewares/upload'
import { verifyIsAdmin } from '../middlewares/verifyIsAdmin'

export const userRoutes = Router()

const listUsersController = new ListUsersController()
const createUserController = new CreateUserController()
const deleteUserController = new DeleteUserController()
const avatarUpdateController = new AvatarUpdateController()
const userUpdateController = new UserUpdateController()
const createUserPerAdminController = new CreateUserPerAdminController()
const getUserPerCodeController = new GetUserPerCodeController()
const getInfosController = new GetInfosController()
const passwordUpdateController = new PasswordUpdateController()

const uploads = new Uploads('avatar', 'image')

userRoutes.post('/', createUserController.handle)
userRoutes.post('/init', getUserPerCodeController.handle)

userRoutes.use(ensureAuthenticated)
userRoutes.delete('/', deleteUserController.handle)
userRoutes.patch(
  '/avatar-update',
  uploads.upload.single('file'),
  avatarUpdateController.handle,
)
userRoutes.patch('/', userUpdateController.handle)
userRoutes.get('/', getInfosController.handle)
userRoutes.patch('/password', passwordUpdateController.handle)

userRoutes.use(verifyIsAdmin)
userRoutes.delete('/:id', deleteUserController.handle)
userRoutes.get('/all', listUsersController.handle)
userRoutes.post('/create', createUserPerAdminController.handle)
