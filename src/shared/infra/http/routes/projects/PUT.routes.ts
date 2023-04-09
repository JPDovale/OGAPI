import { Router } from 'express'

import { QuitProjectController } from '@modules/projects/controllers/QuitProjectController'

export const projectsRoutesPut = Router()

const quitProjectController = new QuitProjectController()

projectsRoutesPut.put('/:projectId/quit', quitProjectController.handle)
