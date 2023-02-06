import { Router } from 'express'

import { CreateBookController } from '@modules/books/useCases/CreateBook/CreateBookController'
import { CreateCapituleController } from '@modules/books/useCases/CreateCapitule/CreateCapituleController'

export const booksRoutesPost = Router()

const createBookController = new CreateBookController()
const createCapituleController = new CreateCapituleController()

booksRoutesPost.post('/', createBookController.handle)
booksRoutesPost.post('/capitules', createCapituleController.handle)
