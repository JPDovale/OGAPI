import { Router } from 'express'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { boxesRoutesDelete } from './DELETE.routes'
import { boxesRoutesGet } from './GET.routes'
import { boxesRoutesPost } from './POST.routes'
import { boxesRoutesPut } from './PUT.routes'

export const boxesRoutes = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

boxesRoutes.use(ensureAuthenticated.verify)
boxesRoutes.use('/', boxesRoutesPost)
boxesRoutes.use('/', boxesRoutesPut)
boxesRoutes.use('/', boxesRoutesDelete)
boxesRoutes.use('/', boxesRoutesGet)
