import { Router } from 'express'

import { DeleteAppearanceController } from '@modules/persons/controllers/DeleteAppearanceController'
import { DeleteCoupleController } from '@modules/persons/controllers/DeleteCoupleController'
import { DeleteDreamController } from '@modules/persons/controllers/DeleteDreamController'
import { DeleteFearController } from '@modules/persons/controllers/DeleteFearController'
import { DeleteImagePersonController } from '@modules/persons/controllers/DeleteImagePersonController'
import { DeleteObjectiveController } from '@modules/persons/controllers/DeleteObjectiveController'
import { DeletePersonalityController } from '@modules/persons/controllers/DeletePersonalityController'
import { DeletePersonController } from '@modules/persons/controllers/DeletePersonController'
import { DeletePowerController } from '@modules/persons/controllers/DeletePowerController'
import { DeleteTraumaController } from '@modules/persons/controllers/DeleteTraumaController'
import { DeleteValuesController } from '@modules/persons/controllers/DeleteValueController'
import { DeleteWisheController } from '@modules/persons/controllers/DeleteWisheController'

export const personsRoutesDelete = Router()

const deleteAppearanceController = new DeleteAppearanceController()
const deleteCoupleController = new DeleteCoupleController()
const deleteDreamController = new DeleteDreamController()
const deleteFearsController = new DeleteFearController()
const deleteImagePersonController = new DeleteImagePersonController()
const deleteObjectiveController = new DeleteObjectiveController()
const deletePersonController = new DeletePersonController()
const deletePersonalityController = new DeletePersonalityController()
const deletePowerController = new DeletePowerController()
const deleteTraumaController = new DeleteTraumaController()
const deleteValuesController = new DeleteValuesController()
const deleteWishesController = new DeleteWisheController()

// PATH: api/persons
personsRoutesDelete.delete(
  '/:personId/appearance/:appearanceId',
  deleteAppearanceController.handle,
)
personsRoutesDelete.delete(
  '/:personId/couples/:coupleId',
  deleteCoupleController.handle,
)
personsRoutesDelete.delete(
  '/:personId/dreams/:dreamId',
  deleteDreamController.handle,
)
personsRoutesDelete.delete(
  '/:personId/fears/:fearId',
  deleteFearsController.handle,
)
personsRoutesDelete.delete(
  '/:personId/image',
  deleteImagePersonController.handle,
)
personsRoutesDelete.delete(
  '/:personId/objectives/:objectiveId',
  deleteObjectiveController.handle,
)
personsRoutesDelete.delete('/:personId', deletePersonController.handle)
personsRoutesDelete.delete(
  '/:personId/personalities/:personalityId',
  deletePersonalityController.handle,
)
personsRoutesDelete.delete(
  '/:personId/powers/:powerId',
  deletePowerController.handle,
)
personsRoutesDelete.delete(
  '/:personId/traumas/:traumaID',
  deleteTraumaController.handle,
)
personsRoutesDelete.patch(
  '/:personId/values/:valueId',
  deleteValuesController.handle,
)
personsRoutesDelete.patch(
  '/:personId/wishes/:wisheId',
  deleteWishesController.handle,
)
