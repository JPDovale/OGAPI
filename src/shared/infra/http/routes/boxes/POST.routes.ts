import { Router } from 'express'

import { CreateArchiveController } from '@modules/boxes/useCases/CrateArchive/CreateArchiveController'
import { CreateBoxController } from '@modules/boxes/useCases/CreateBox/CreateBoxController'

export const boxesRoutesPots = Router()

const createBoxController = new CreateBoxController()
const createArchiveController = new CreateArchiveController()

boxesRoutesPots.post('/', createBoxController.handle)
boxesRoutesPots.post('/archives', createArchiveController.handle)
