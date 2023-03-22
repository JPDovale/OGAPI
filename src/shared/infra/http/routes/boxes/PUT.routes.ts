import { Router } from 'express'

import { SaveImageController } from '@modules/boxes/useCases/SaveImages/SaveImageController'

import { Uploads } from '../../middlewares/upload'

export const boxesRoutesPut = Router()

const uploads = new Uploads('boxes', 'image')
const saveImageController = new SaveImageController()

boxesRoutesPut.patch(
  '/:boxId/archives/:archiveId',
  uploads.upload.single('file'),
  saveImageController.handle,
)
