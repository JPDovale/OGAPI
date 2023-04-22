import { Router } from 'express'

import { GetProjectController } from '@modules/projects/controllers/GetProjectController'
import { ListProjectsPerUserController } from '@modules/projects/controllers/ListProjectsPerUserController/ListProjectsPerUserController'

export const projectsRoutesGet = Router()

const listProjectsPerUserController = new ListProjectsPerUserController()
const getProjectController = new GetProjectController()

// PATH: api/projects
projectsRoutesGet.get('/', listProjectsPerUserController.handle)
projectsRoutesGet.get('/:projectId', getProjectController.handle)
