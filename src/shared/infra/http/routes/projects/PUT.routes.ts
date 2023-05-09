import { Router } from 'express'

import { PlotUpdateController } from '@modules/projects/controllers/PlotUpdateController'
import { QuitProjectController } from '@modules/projects/controllers/QuitProjectController'

export const projectsRoutesPut = Router()

const quitProjectController = new QuitProjectController()
const plotUpdateController = new PlotUpdateController()

// PATH: api/projects
projectsRoutesPut.put('/:projectId/quit', quitProjectController.handle)
projectsRoutesPut.put('/:projectId/plot', plotUpdateController.handle)
