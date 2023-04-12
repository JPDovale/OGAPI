import { Router } from 'express'

import { UpdateAppearanceController } from '@modules/persons/controllers/UpdateAppearanceController'
import { UpdateCoupleController } from '@modules/persons/controllers/UpdateCoupleController/UpdateCoupleController'
import { UpdateDreamController } from '@modules/persons/controllers/UpdateDreamController'
import { UpdateFearController } from '@modules/persons/controllers/UpdateFearController'
import { UpdateObjectiveController } from '@modules/persons/controllers/UpdateObjectiveController'
import { UpdatePersonalityController } from '@modules/persons/controllers/UpdatePersonalityController'
import { UpdatePersonController } from '@modules/persons/controllers/UpdatePersonController'
import { UpdatePowerController } from '@modules/persons/controllers/UpdatePowerController'
import { UpdateTraumaController } from '@modules/persons/controllers/UpdateTraumaController'
import { UpdateValueController } from '@modules/persons/controllers/UpdateValueController'
import { UpdateWisheController } from '@modules/persons/controllers/UpdateWisheController'

export const personsRoutesPut = Router()

const updateAppearanceController = new UpdateAppearanceController()
const updateCouplesController = new UpdateCoupleController()
const updateDreamController = new UpdateDreamController()
const updateFearsController = new UpdateFearController()
const updateObjectiveController = new UpdateObjectiveController()
const updatePersonController = new UpdatePersonController()
const updatePersonalityController = new UpdatePersonalityController()
const updatePowersController = new UpdatePowerController()
const updateTraumaController = new UpdateTraumaController()
const updateValueController = new UpdateValueController()
const updateWishesController = new UpdateWisheController()

// PATH: api/persons
personsRoutesPut.put(
  '/:personId/appearances/:appearanceId',
  updateAppearanceController.handle,
)
personsRoutesPut.put(
  '/:personId/couples/:coupleId',
  updateCouplesController.handle,
)
personsRoutesPut.put('/:personId/dreams/:dreamId', updateDreamController.handle)
personsRoutesPut.put('/:personId/fears/:fearId', updateFearsController.handle)
personsRoutesPut.put(
  '/:personId/objectives/:objectiveId',
  updateObjectiveController.handle,
)
personsRoutesPut.put('/:personId', updatePersonController.handle)
personsRoutesPut.put(
  '/:personId;personalities/:personalityId',
  updatePersonalityController.handle,
)
personsRoutesPut.put(
  '/:personId/powers/:powerId',
  updatePowersController.handle,
)
personsRoutesPut.put(
  '/:personId/traumas/:traumaId',
  updateTraumaController.handle,
)
personsRoutesPut.put('/:personId/values/:valueId', updateValueController.handle)
personsRoutesPut.put(
  '/:personId/wishes/:wisheId',
  updateWishesController.handle,
)
