import { Router } from 'express'

import { DeleteArchiveController } from '@modules/boxes/controllers/DeleteArchiveController'
import { DeleteBoxController } from '@modules/boxes/controllers/DeleteBoxController'
import { DeleteImageInArchiveController } from '@modules/boxes/controllers/DeleteImageInArchiveController'

export const boxesRoutesDelete = Router()

const deleteArchiveController = new DeleteArchiveController()
const deleteImageInArchiveController = new DeleteImageInArchiveController()
const deleteBoxController = new DeleteBoxController()

// PATH: api/boxes
boxesRoutesDelete.delete(
  '/:boxId/archives/:archiveId',
  deleteArchiveController.handle,
)
boxesRoutesDelete.delete(
  '/:boxId/archives/:archiveId/images/:imageId',
  deleteImageInArchiveController.handle,
)
boxesRoutesDelete.delete('/:boxId', deleteBoxController.handle)
