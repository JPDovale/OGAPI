import { Router } from 'express'

import { booksRoutes } from './books'
import { boxesRoutes } from './boxes'
import { personsRoutes } from './persons'
import { productsRoutes } from './products'
import { projectsRoutes } from './projects'
import { sessionsRoutes } from './sessions'
import { timeLinesRoutes } from './timelines'
import { userRoutes } from './users'

export const router = Router()

router.get('/', (req, res) => {
  return res.status(200).send('Hello :)')
})

router.use('/products', productsRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/users', userRoutes)
router.use('/projects', projectsRoutes)
router.use('/persons', personsRoutes)
router.use('/books', booksRoutes)
router.use('/boxes', boxesRoutes)
router.use('/timelines', timeLinesRoutes)
