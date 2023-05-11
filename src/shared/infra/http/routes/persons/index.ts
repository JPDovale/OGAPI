import { Router } from 'express'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { personsRoutesDelete } from './DELETE.routes'
import { personsRoutesGet } from './GET.routes'
import { personsRoutesPatch } from './PATCH.routes'
import { personsRoutesPost } from './POST.routes'
import { personsRoutesPut } from './PUT.routes'

export const personsRoutes = Router()

const ensureAuthenticated = new EnsureAuthenticatedMiddleware()

personsRoutes.use(ensureAuthenticated.verify)
personsRoutes.use(personsRoutesPost)
personsRoutes.use(personsRoutesDelete)
personsRoutes.use(personsRoutesPut)
personsRoutes.use(personsRoutesPatch)
personsRoutes.use(personsRoutesGet)
