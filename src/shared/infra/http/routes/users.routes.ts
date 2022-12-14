import { Router } from 'express'

import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController'
import { DeleteUserController } from '@modules/accounts/useCases/deleteUser/DeleteUserController'
import { ListUsersController } from '@modules/accounts/useCases/listUsers/ListUsersController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../middlewares/verifyIsAdmin'

export const userRoutes = Router()

const listUsersController = new ListUsersController()

const createUserController = new CreateUserController()
const deleteUserController = new DeleteUserController()

userRoutes.post('/', createUserController.handle)

userRoutes.use(ensureAuthenticated)
userRoutes.delete('/', deleteUserController.handle)

userRoutes.use(verifyIsAdmin)
userRoutes.delete('/:id', deleteUserController.handle)
userRoutes.get('/', listUsersController.handle)
