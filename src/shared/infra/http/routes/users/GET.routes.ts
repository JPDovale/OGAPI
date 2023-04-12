import { Router } from 'express'

import { GetInfosController } from '@modules/accounts/controllers/GetInfosController'
import { ListUsersController } from '@modules/accounts/controllers/ListUsersController'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

export const userRoutesGet = Router()

const getInfosController = new GetInfosController()
const listUsersController = new ListUsersController()

// PATH: api/users
userRoutesGet.use(ensureAuthenticated)
userRoutesGet.get('/', getInfosController.handle)

userRoutesGet.use(verifyIsAdmin)
userRoutesGet.get('/all', listUsersController.handle)
