import { Router } from 'express'

import { ReorderScenesController } from '@modules/books/useCases/ReorderScenes/ReorderScenesController'
import { SetCompleteSceneController } from '@modules/books/useCases/SetCompleteScene/SetCompleteSceneController'
import { UpdateCapituleController } from '@modules/books/useCases/UpdateCapitule/UpdateCapituleController'
import { UpdateSceneController } from '@modules/books/useCases/UpdateScene/UpdateSceneController'

export const booksRoutesPut = Router()

const updateCapituleController = new UpdateCapituleController()
const setCompleteSceneController = new SetCompleteSceneController()
const reorderScenesController = new ReorderScenesController()
const updateSceneController = new UpdateSceneController()

booksRoutesPut.put('/capitules', updateCapituleController.handle)
booksRoutesPut.put(
  '/capitules/scenes/complete',
  setCompleteSceneController.handle,
)
booksRoutesPut.put('/capitules/scenes/reorder', reorderScenesController.handle)
booksRoutesPut.put('/capitules/scenes', updateSceneController.handle)
