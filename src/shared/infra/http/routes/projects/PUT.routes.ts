import { Router } from 'express'

import { QuitProjectController } from '@modules/projects/controllers/QuitProjectController'

export const projectsRoutesPut = Router()

const quitProjectController = new QuitProjectController()

// PATH: api/projects
projectsRoutesPut.put('/:projectId/quit', quitProjectController.handle)
