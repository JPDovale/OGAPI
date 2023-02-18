import { Router } from 'express'

import { CreateBookController } from '@modules/books/useCases/CreateBook/CreateBookController'
import { CreateCapituleController } from '@modules/books/useCases/CreateCapitule/CreateCapituleController'
import { CreateSceneController } from '@modules/books/useCases/CreateScene/CreateSceneController'

export const booksRoutesPost = Router()

const createBookController = new CreateBookController()
const createCapituleController = new CreateCapituleController()
const createSceneController = new CreateSceneController()

booksRoutesPost.post('/', createBookController.handle)
booksRoutesPost.post('/capitules', createCapituleController.handle)
booksRoutesPost.post('/capitules/scenes', createSceneController.handle)
