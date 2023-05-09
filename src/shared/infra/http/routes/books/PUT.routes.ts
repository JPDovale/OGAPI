import { Router } from 'express'

import { ReorderCapitulesController } from '@modules/books/controllers/ReorderCapitulesController/ReorderCapitulesController'
import { ReorderScenesController } from '@modules/books/controllers/ReorderScenesController'
import { SetCompleteSceneController } from '@modules/books/controllers/SetCompleteSceneController'
import { UpdateBookController } from '@modules/books/controllers/UpdateBookController'
import { UpdateCapituleController } from '@modules/books/controllers/UpdateCapituleController/UpdateCapituleController'
import { UpdateSceneController } from '@modules/books/controllers/UpdateSceneController'

export const booksRoutesPut = Router()

const updateCapituleController = new UpdateCapituleController()
const setCompleteSceneController = new SetCompleteSceneController()
const reorderScenesController = new ReorderScenesController()
const updateSceneController = new UpdateSceneController()
const reorderCapitulesController = new ReorderCapitulesController()
const updateBookController = new UpdateBookController()

// PATH: api/books
booksRoutesPut.put('/:bookId', updateBookController.handle)

booksRoutesPut.put(
  '/:bookId/capitules/reorder',
  reorderCapitulesController.handle,
)

booksRoutesPut.put(
  '/:bookId/capitules/:capituleId',
  updateCapituleController.handle,
)
booksRoutesPut.put(
  '/:bookId/capitules/:capituleId/scenes/:sceneId/complete',
  setCompleteSceneController.handle,
)
booksRoutesPut.put(
  '/:bookId/capitules/:capituleId/scenes/reorder',
  reorderScenesController.handle,
)

booksRoutesPut.put(
  '/:bookId/capitules/:capituleId/scenes/:sceneId',
  updateSceneController.handle,
)
