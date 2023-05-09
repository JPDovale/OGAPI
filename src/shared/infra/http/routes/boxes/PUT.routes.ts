import { Router } from 'express'

import { UpdateArchiveController } from '@modules/boxes/controllers/UpdateArchiveController'
import { UpdateBoxController } from '@modules/boxes/controllers/UpdateBoxController'

export const boxesRoutesPut = Router()

const updateArchiveController = new UpdateArchiveController()
const updateBoxController = new UpdateBoxController()

// PATH: api/boxes
boxesRoutesPut.put(
  '/:boxId/archives/:archiveId',
  updateArchiveController.handle,
)
boxesRoutesPut.put('/:boxId', updateBoxController.handle)
