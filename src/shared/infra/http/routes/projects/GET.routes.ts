import { Router } from 'express'

import { GetAppearancesController } from '@modules/projects/controllers/GetAppearancesController'
import { GetDreamsController } from '@modules/projects/controllers/GetDreamsController'
import { GetFearsController } from '@modules/projects/controllers/GetFearsController'
import { GetObjectivesController } from '@modules/projects/controllers/GetObjectivesController'
import { GetPersonalitiesController } from '@modules/projects/controllers/GetPersonalitiesController'
import { GetPowersController } from '@modules/projects/controllers/GetPowersController'
import { GetProjectController } from '@modules/projects/controllers/GetProjectController'
import { GetTraumasController } from '@modules/projects/controllers/GetTraumasController'
import { GetValuesController } from '@modules/projects/controllers/GetValuesController'
import { GetWishesController } from '@modules/projects/controllers/GetWishesController'
import { ListProjectsPerUserController } from '@modules/projects/controllers/ListProjectsPerUserController/ListProjectsPerUserController'

export const projectsRoutesGet = Router()

const listProjectsPerUserController = new ListProjectsPerUserController()
const getProjectController = new GetProjectController()
const getObjectivesController = new GetObjectivesController()
const getPersonalitiesController = new GetPersonalitiesController()
const getValuesController = new GetValuesController()
const getTraumasController = new GetTraumasController()
const getAppearancesController = new GetAppearancesController()
const getDreamsController = new GetDreamsController()
const getFearsController = new GetFearsController()
const getWishesController = new GetWishesController()
const getPowersController = new GetPowersController()

// PATH: api/projects
projectsRoutesGet.get('/', listProjectsPerUserController.handle)
projectsRoutesGet.get('/:projectId', getProjectController.handle)
projectsRoutesGet.get('/:projectId/objectives', getObjectivesController.handle)
projectsRoutesGet.get(
  '/:projectId/personalities',
  getPersonalitiesController.handle,
)
projectsRoutesGet.get('/:projectId/values', getValuesController.handle)
projectsRoutesGet.get('/:projectId/traumas', getTraumasController.handle)
projectsRoutesGet.get(
  '/:projectId/appearances',
  getAppearancesController.handle,
)
projectsRoutesGet.get('/:projectId/dreams', getDreamsController.handle)
projectsRoutesGet.get('/:projectId/fears', getFearsController.handle)
projectsRoutesGet.get('/:projectId/wishes', getWishesController.handle)
projectsRoutesGet.get('/:projectId/powers', getPowersController.handle)
