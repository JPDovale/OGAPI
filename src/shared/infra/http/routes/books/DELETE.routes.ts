import { Router } from 'express'

import { RemoveFrontCoverController } from '@modules/books/useCases/RemoveFrontCover/RemoveFrontCoverController'

export const booksRoutesDelete = Router()

const removeFrontCoverController = new RemoveFrontCoverController()

booksRoutesDelete.delete(
  '/front-cover/:bookId',
  removeFrontCoverController.handle,
)
