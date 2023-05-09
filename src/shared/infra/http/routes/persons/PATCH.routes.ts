import { Router } from 'express'

import { UpdateImagePersonController } from '@modules/persons/controllers/UpdateImagePersonController'

import { Uploads } from '../../middlewares/upload'

export const personsRoutesPatch = Router()

const updateImagePersonController = new UpdateImagePersonController()

const uploads = new Uploads('persons', 'image')

// PATH: api/persons
personsRoutesPatch.patch(
  '/:personId/image',
  uploads.upload.single('file'),
  updateImagePersonController.handle,
)
