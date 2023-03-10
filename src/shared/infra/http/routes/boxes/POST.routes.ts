import { Router } from 'express'

import { CreateBoxController } from '@modules/boxes/useCases/CreateBox/CreateBoxController'

export const boxesRoutesPots = Router()

const createBoxController = new CreateBoxController()

boxesRoutesPots.post('/', createBoxController.handle)
