import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { personsRoutesDelete } from './DELETE.routes'
import { personsRoutesPatch } from './PATCH.routes'
import { personsRoutesPost } from './POST.routes'
import { personsRoutesPut } from './PUT.routes'

export const personsRoutes = Router()

personsRoutes.use(ensureAuthenticated)
personsRoutes.use(personsRoutesPost)
personsRoutes.use(personsRoutesDelete)
personsRoutes.use(personsRoutesPut)
personsRoutes.use(personsRoutesPatch)
