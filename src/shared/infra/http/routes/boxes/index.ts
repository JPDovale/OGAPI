import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { boxesRoutesDelete } from './DELETE.routes'
import { boxesRoutesPots } from './POST.routes'
import { boxesRoutesPut } from './PUT.routes'

export const boxesRoutes = Router()
boxesRoutes.use(ensureAuthenticated)

boxesRoutes.use('/', boxesRoutesPots)
boxesRoutes.use('/', boxesRoutesPut)
boxesRoutes.use('/', boxesRoutesDelete)
