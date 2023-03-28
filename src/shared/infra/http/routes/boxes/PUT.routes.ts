import { Router } from 'express'

import { SaveImageController } from '@modules/boxes/useCases/SaveImages/SaveImageController'
import { UpdateArchiveController } from '@modules/boxes/useCases/UpdateArchive/UpdateArchiveController'
import { UpdateBoxController } from '@modules/boxes/useCases/UpdateBox/UpdateBoxController'

import { Uploads } from '../../middlewares/upload'

export const boxesRoutesPut = Router()

const uploads = new Uploads('boxes', 'image')
const saveImageController = new SaveImageController()
const updateArchiveController = new UpdateArchiveController()
const updateBoxController = new UpdateBoxController()

boxesRoutesPut.patch(
  '/:boxId/archives/:archiveId/images',
  uploads.upload.single('file'),
  saveImageController.handle,
)
boxesRoutesPut.put(
  '/:boxId/archives/:archiveId',
  updateArchiveController.handle,
)
boxesRoutesPut.put('/:boxId', updateBoxController.handle)
