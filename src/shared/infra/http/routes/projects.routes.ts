import { Router } from 'express'

import { CreateProjectController } from '@modules/projects/useCases/createProject/createProjectController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

export const projectsRoutes = Router()

const createProjectController = new CreateProjectController()

projectsRoutes.post('/', ensureAuthenticated, createProjectController.handle)
