import { Router } from 'express'

import { booksRoutes } from './books'
import { boxesRoutes } from './boxes'
import { personsRoutes } from './persons.routes'
import { projectsRoutes } from './projects.routes'
import { sessionsRoutes } from './sessions.routes'
import { userRoutes } from './users.routes'

export const router = Router()

router.get('/', (req, res) => {
  return res.status(200).send('Hello world')
})

router.use('/users', userRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/projects', projectsRoutes)
router.use('/persons', personsRoutes)
router.use('/books', booksRoutes)
router.use('/boxes', boxesRoutes)
