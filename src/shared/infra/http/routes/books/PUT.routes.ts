import { Router } from 'express'

import { UpdateCapituleController } from '@modules/books/useCases/UpdateCapitule/UpdateCapituleController'

export const booksRoutesPut = Router()

const updateCapituleController = new UpdateCapituleController()

booksRoutesPut.put('/capitules', updateCapituleController.handle)
