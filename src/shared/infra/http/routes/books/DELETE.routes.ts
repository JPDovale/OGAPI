import { Router } from 'express'

import { DeleteSceneController } from '@modules/books/useCases/DeleteScene/DeleteSceneController'
import { RemoveFrontCoverController } from '@modules/books/useCases/RemoveFrontCover/RemoveFrontCoverController'

export const booksRoutesDelete = Router()

const removeFrontCoverController = new RemoveFrontCoverController()
const deleteSceneController = new DeleteSceneController()

booksRoutesDelete.delete(
  '/front-cover/:bookId',
  removeFrontCoverController.handle,
)

booksRoutesDelete.delete(
  '/:bookId/capitules/:capituleId/scenes/:sceneId',
  deleteSceneController.handle,
)
