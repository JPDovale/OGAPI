import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { booksRoutesDelete } from './DELETE.routes'
import { booksRoutesPatch } from './PATCH.routes'
import { booksRoutesPost } from './POST.routes'

export const booksRoutes = Router()
booksRoutes.use(ensureAuthenticated)

booksRoutes.use('/', booksRoutesPost)
booksRoutes.use('/', booksRoutesPatch)
booksRoutes.use('/', booksRoutesDelete)
