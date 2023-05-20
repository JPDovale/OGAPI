import { Router } from 'express'

import { EnsureAuthenticatedMiddleware } from '../../middlewares/ensureAuthenticated'
import { timeLinesRoutesGet } from './GET.routes'
import { timeLinesRoutesPatch } from './PATCH.routes'
import { timeLinesRoutesPost } from './POST.routes'

export const timeLinesRoutes = Router()

const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

timeLinesRoutes.use(ensureAuthenticatedMiddleware.verify)
timeLinesRoutes.use('/', timeLinesRoutesPost)
timeLinesRoutes.use('/', timeLinesRoutesGet)
timeLinesRoutes.use('/', timeLinesRoutesPatch)
