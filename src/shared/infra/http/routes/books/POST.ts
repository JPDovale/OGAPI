import { Router } from 'express'

import { CreateBookController } from '@modules/books/useCases/CreateBookController'

export const booksRoutesPost = Router()

const createBookController = new CreateBookController()

booksRoutesPost.post('/', createBookController.handle)
