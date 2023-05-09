import { Router } from 'express'

import { UpdateFrontCoverBookController } from '@modules/books/controllers/UpdateFrontCoverBookController'

import { Uploads } from '../../middlewares/upload'

export const booksRoutesPatch = Router()

const updateFrontCoverBookController = new UpdateFrontCoverBookController()

const uploads = new Uploads('books', 'image')

// PATH: api/books
booksRoutesPatch.patch(
  '/:bookId/image',
  uploads.upload.single('file'),
  updateFrontCoverBookController.handle,
)
