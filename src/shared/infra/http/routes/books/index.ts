import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { booksRoutesDelete } from './DELETE.routes'
import { booksRoutesGet } from './GET.routes'
import { booksRoutesPatch } from './PATCH.routes'
import { booksRoutesPost } from './POST.routes'
import { booksRoutesPut } from './PUT.routes'

export const booksRoutes = Router()
booksRoutes.use(ensureAuthenticated)

booksRoutes.use('/', booksRoutesPost)
booksRoutes.use('/', booksRoutesPatch)
booksRoutes.use('/', booksRoutesDelete)
booksRoutes.use('/', booksRoutesPut)
booksRoutes.use('/', booksRoutesGet)
