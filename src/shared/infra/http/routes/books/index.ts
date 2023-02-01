import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { booksRoutesPost } from './POST'

export const booksRoutes = Router()
booksRoutes.use(ensureAuthenticated)

booksRoutes.use('/', booksRoutesPost)
