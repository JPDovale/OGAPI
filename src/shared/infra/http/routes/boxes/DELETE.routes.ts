import { Router } from 'express'

import { DeleteArchiveController } from '@modules/boxes/useCases/DeleteArchive/DeleteArchiveController'
import { DeleteBoxController } from '@modules/boxes/useCases/DeleteBox/DeleteBoxController'
import { DeleteImageInArchiveController } from '@modules/boxes/useCases/DeleteImageInArchive/DeleteImageInArchiveController'

export const boxesRoutesDelete = Router()

const deleteArchiveController = new DeleteArchiveController()
const deleteImageInArchiveController = new DeleteImageInArchiveController()
const deleteBoxController = new DeleteBoxController()

boxesRoutesDelete.delete(
  '/:boxId/archives/:archiveId',
  deleteArchiveController.handle,
)
boxesRoutesDelete.delete(
  '/:boxId/archives/:archiveId/images/:imageId',
  deleteImageInArchiveController.handle,
)
boxesRoutesDelete.delete('/:boxId', deleteBoxController.handle)
