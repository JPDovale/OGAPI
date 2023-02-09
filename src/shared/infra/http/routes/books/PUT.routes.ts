import { Router } from 'express'

import { SetCompleteSceneController } from '@modules/books/useCases/SetCompleteScene/SetCompleteSceneController'
import { UpdateCapituleController } from '@modules/books/useCases/UpdateCapitule/UpdateCapituleController'

export const booksRoutesPut = Router()

const updateCapituleController = new UpdateCapituleController()
const setCompleteSceneController = new SetCompleteSceneController()

booksRoutesPut.put('/capitules', updateCapituleController.handle)
booksRoutesPut.put(
  '/capitules/scenes/complete',
  setCompleteSceneController.handle,
)
