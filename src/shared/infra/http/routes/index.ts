import { Router } from 'express'

import { projectsRoutes } from './projects.routes'
import { sessionsRoutes } from './sessions.routes'
import { userRoutes } from './users.routes'

export const router = Router()

router.use('/users', userRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/projects', projectsRoutes)
