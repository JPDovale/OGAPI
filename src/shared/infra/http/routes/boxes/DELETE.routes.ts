import { Router } from 'express'

import { DeleteArchiveController } from '@modules/boxes/useCases/DeleteArchive/DeleteArchiveController'

export const boxesRoutesDelete = Router()

const deleteArchiveController = new DeleteArchiveController()

boxesRoutesDelete.delete(
  '/:boxId/archives/:archiveId',
  deleteArchiveController.handle,
)
