import { Router } from 'express'

import { AddGenreController } from '@modules/books/controllers/AddGenreController'
import { CreateBookController } from '@modules/books/controllers/CreateBookController'
import { CreateCapituleController } from '@modules/books/controllers/CreateCapituleController'
import { CreateSceneController } from '@modules/books/controllers/CreateSceneController'

export const booksRoutesPost = Router()

const createBookController = new CreateBookController()
const createCapituleController = new CreateCapituleController()
const createSceneController = new CreateSceneController()
const addGenreController = new AddGenreController()

// PATH: api/books
booksRoutesPost.post('/:projectId', createBookController.handle)
booksRoutesPost.post('/:bookId/capitules', createCapituleController.handle)
booksRoutesPost.post(
  '/:bookId/capitules/:capituleId/scenes',
  createSceneController.handle,
)
booksRoutesPost.post('/:bookId/genres', addGenreController.handle)
