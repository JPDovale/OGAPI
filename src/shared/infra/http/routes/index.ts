import { Router } from 'express'

import { VerifyApiKey } from '../middlewares/verifyApiKey'
import { booksRoutes } from './books'
import { boxesRoutes } from './boxes'
import { personsRoutes } from './persons'
import { productsRoutes } from './products'
import { projectsRoutes } from './projects'
import { sessionsRoutes } from './sessions'
import { timeLinesRoutes } from './timelines'
import { userRoutes } from './users'

export const router = Router()

const verifyApiKey = new VerifyApiKey()

router.use(verifyApiKey.verify)
router.get('/', (req, res) => {
  res.send('hello world :)')
})

router.use('/products', productsRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/users', userRoutes)
router.use('/projects', projectsRoutes)
router.use('/persons', personsRoutes)
router.use('/books', booksRoutes)
router.use('/boxes', boxesRoutes)
router.use('/timelines', timeLinesRoutes)
