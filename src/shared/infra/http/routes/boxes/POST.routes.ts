import { Router } from 'express'

import { CreateArchiveController } from '@modules/boxes/controllers/CreateArchiveController'
import { CreateBoxController } from '@modules/boxes/controllers/CreateBoxController'
import { SaveImageController } from '@modules/boxes/controllers/SaveImageController'

import { Uploads } from '../../middlewares/upload'

export const boxesRoutesPost = Router()

const createBoxController = new CreateBoxController()
const createArchiveController = new CreateArchiveController()
const saveImageController = new SaveImageController()

const uploads = new Uploads('boxes', 'image')

// PATH: api/boxes
boxesRoutesPost.post('/', createBoxController.handle)
boxesRoutesPost.post('/:boxId/archives', createArchiveController.handle)
boxesRoutesPost.post(
  '/:boxId/archives/:archiveId/images',
  uploads.upload.single('file'),
  saveImageController.handle,
)
