import { Router } from 'express'

import { MigrateController } from '@modules/accounts/useCases/Migrate/MigrateController'

import { booksRoutes } from './books'
import { boxesRoutes } from './boxes'
import { personsRoutes } from './persons'
import { projectsRoutes } from './projects'
import { sessionsRoutes } from './sessions'
import { userRoutes } from './users'

export const router = Router()

const migrateController = new MigrateController()

router.get('/', (req, res) => {
  return res.status(200).send('Hello world')
})

router.post('/migrate', migrateController.handle)

router.use('/users', userRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/projects', projectsRoutes)
router.use('/persons', personsRoutes)
router.use('/books', booksRoutes)
router.use('/boxes', boxesRoutes)
