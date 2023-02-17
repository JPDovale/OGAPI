import { Router } from 'express'

import { DeleteCapituleController } from '@modules/books/useCases/DeleteCapitule/DeleteCapituleController'
import { DeleteSceneController } from '@modules/books/useCases/DeleteScene/DeleteSceneController'
import { RemoveFrontCoverController } from '@modules/books/useCases/RemoveFrontCover/RemoveFrontCoverController'

export const booksRoutesDelete = Router()

const removeFrontCoverController = new RemoveFrontCoverController()
const deleteSceneController = new DeleteSceneController()
const deleteCapituleController = new DeleteCapituleController()

booksRoutesDelete.delete(
  '/front-cover/:bookId',
  removeFrontCoverController.handle,
)

booksRoutesDelete.delete(
  '/:bookId/capitules/:capituleId/scenes/:sceneId',
  deleteSceneController.handle,
)

booksRoutesDelete.delete(
  '/:bookId/capitules/:capituleId',
  deleteCapituleController.handle,
)
