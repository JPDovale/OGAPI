import { Router } from 'express'

import { UpdateFrontCoverBookController } from '@modules/books/useCases/UpdateFrontCover/UpdateFrontCoverBookController'

import { Uploads } from '../../middlewares/upload'

export const booksRoutesPatch = Router()

const updateFrontCoverBookController = new UpdateFrontCoverBookController()

const uploads = new Uploads('books', 'image')

booksRoutesPatch.patch(
  '/update-frontCover/:bookId',
  uploads.upload.single('file'),
  updateFrontCoverBookController.handle,
)
