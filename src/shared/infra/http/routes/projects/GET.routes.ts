import { Router } from 'express'

import { ListProjectsPerUserController } from '@modules/projects/useCases/listProjectsPerUser/ListProjectsPerUserController'

export const projectsRoutesGet = Router()

const listProjectsPerUserController = new ListProjectsPerUserController()

projectsRoutesGet.get('/', listProjectsPerUserController.handle)
