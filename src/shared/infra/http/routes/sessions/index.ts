import { Router } from 'express'

import { sessionsRoutesPost } from './POST.routes'

export const sessionsRoutes = Router()

sessionsRoutes.use(sessionsRoutesPost)
