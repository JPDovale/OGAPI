import { Router } from 'express'

import { MigrateOldProjectsTagsToBoxesController } from '@modules/boxes/useCases/MigrateOldProjectsTagsToBoxesController'

import { verifyIsAdmin } from '../../middlewares/verifyIsAdmin'

const migrateOldProjectsTagsToBoxesController =
  new MigrateOldProjectsTagsToBoxesController()

export const boxesRoutesPots = Router()

boxesRoutesPots.use(verifyIsAdmin)
boxesRoutesPots.post('/migrate', migrateOldProjectsTagsToBoxesController.handle)
