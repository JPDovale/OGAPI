import { Router } from 'express'

import { DeleteImageController } from '@modules/projects/controllers/DeleteImageController'
import { DeleteProjectController } from '@modules/projects/controllers/DeleteProjectController'

export const projectsRoutesDelete = Router()

const deleteProjectController = new DeleteProjectController()
const deleteImageController = new DeleteImageController()

// PATH: api/projects
projectsRoutesDelete.delete('/:projectId/image', deleteImageController.handle)
projectsRoutesDelete.delete('/:projectId', deleteProjectController.handle)
