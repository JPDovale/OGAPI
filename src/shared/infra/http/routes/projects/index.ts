import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated'
import { projectsRoutesDelete } from './DELETE.routes'
import { projectsRoutesGet } from './GET.routes'
import { projectsRoutesPatch } from './PATCH.routes'
import { projectsRoutesPost } from './POST.routes'
import { projectsRoutesPut } from './PUT.routes'

export const projectsRoutes = Router()

projectsRoutes.use(ensureAuthenticated)
projectsRoutes.use(projectsRoutesGet)
projectsRoutes.use(projectsRoutesPost)
projectsRoutes.use(projectsRoutesDelete)
projectsRoutes.use(projectsRoutesPut)
projectsRoutes.use(projectsRoutesPatch)
