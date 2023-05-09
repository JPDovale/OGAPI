import { Router } from 'express'

import { GetBoxesController } from '@modules/boxes/controllers/GetBoxesController'

export const boxesRoutesGet = Router()

const getBoxesController = new GetBoxesController()

boxesRoutesGet.get('/', getBoxesController.handle)
