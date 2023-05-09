import { Router } from 'express'

import { DeleteBookController } from '@modules/books/controllers/DeleteBookController'
import { DeleteCapituleController } from '@modules/books/controllers/DeleteCapituleController'
import { DeleteSceneController } from '@modules/books/controllers/DeleteSceneController'
import { RemoveFrontCoverController } from '@modules/books/controllers/RemoveFrontCoverController'
import { RemoveGenreController } from '@modules/books/controllers/RemoveGenreController'

export const booksRoutesDelete = Router()

const removeFrontCoverController = new RemoveFrontCoverController()
const deleteSceneController = new DeleteSceneController()
const deleteCapituleController = new DeleteCapituleController()
const removeGenreController = new RemoveGenreController()
const deleteBookController = new DeleteBookController()

// PATH: api/books
booksRoutesDelete.delete('/:bookId/image', removeFrontCoverController.handle)
booksRoutesDelete.delete(
  '/:bookId/capitules/:capituleId/scenes/:sceneId',
  deleteSceneController.handle,
)
booksRoutesDelete.delete(
  '/:bookId/capitules/:capituleId',
  deleteCapituleController.handle,
)
booksRoutesDelete.delete('/:bookId', deleteBookController.handle)
booksRoutesDelete.delete(
  '/:bookId/genres/:genreId',
  removeGenreController.handle,
)
