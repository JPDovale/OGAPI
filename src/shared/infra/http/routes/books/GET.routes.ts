import { Router } from 'express'

import { GetBookController } from '@modules/books/controllers/GetBookController'
import { GetCapituleController } from '@modules/books/controllers/GetCapituleController'

export const booksRoutesGet = Router()

const getBookController = new GetBookController()
const getCapituleController = new GetCapituleController()

booksRoutesGet.get('/:bookId', getBookController.handle)
booksRoutesGet.get('/capitules/:capituleId', getCapituleController.handle)
