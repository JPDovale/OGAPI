import { Router } from 'express'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { booksRoutesDelete } from './DELETE.routes'
import { booksRoutesGet } from './GET.routes'
import { booksRoutesPatch } from './PATCH.routes'
import { booksRoutesPost } from './POST.routes'
import { booksRoutesPut } from './PUT.routes'

export const booksRoutes = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

booksRoutes.use(ensureAuthenticated.verify)
booksRoutes.use('/', booksRoutesPost)
booksRoutes.use('/', booksRoutesPatch)
booksRoutes.use('/', booksRoutesDelete)
booksRoutes.use('/', booksRoutesPut)
booksRoutes.use('/', booksRoutesGet)
