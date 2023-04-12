import { Router } from 'express'

import { CommentInPersonController } from '@modules/persons/controllers/CommentInPersonController'
import { CreateAppearanceController } from '@modules/persons/controllers/CreateAppearanceController'
import { CreateCoupleController } from '@modules/persons/controllers/CreateCoupleController'
import { CreateDreamController } from '@modules/persons/controllers/CreateDreamController'
import { CreateFearController } from '@modules/persons/controllers/CreateFearController'
import { CreateObjectiveController } from '@modules/persons/controllers/CreateObjectiveController'
import { CreatePersonalityController } from '@modules/persons/controllers/CreatePersonalityController'
import { CreatePersonController } from '@modules/persons/controllers/CreatePersonController'
import { CreatePowerController } from '@modules/persons/controllers/CreatePowerController'
import { CreateTraumaController } from '@modules/persons/controllers/CreateTraumaController'
import { CreateValueController } from '@modules/persons/controllers/CreateValueController'
import { CreateWisheController } from '@modules/persons/controllers/CreateWisheController'
import { ReferenceAppearanceController } from '@modules/persons/controllers/ReferenceAppearanceController'
import { ReferenceDreamController } from '@modules/persons/controllers/ReferenceDreamController'
import { ReferenceFearController } from '@modules/persons/controllers/ReferenceFearController'
import { ReferenceObjectiveController } from '@modules/persons/controllers/ReferenceObjectiveController'
import { ReferencePersonalityController } from '@modules/persons/controllers/ReferencePersonalityController'
import { ReferencePowerController } from '@modules/persons/controllers/ReferencePowerController'
import { ReferenceTraumaController } from '@modules/persons/controllers/ReferenceTraumaController'
import { ReferenceValueController } from '@modules/persons/controllers/ReferenceValueController'
import { ReferenceWisheController } from '@modules/persons/controllers/ReferenceWisheController'
import { ResponseCommentPersonController } from '@modules/persons/controllers/ResponseCommentPersonController'

export const personsRoutesPost = Router()

const createPersonController = new CreatePersonController()
const commentInPersonController = new CommentInPersonController()
const createAppearanceController = new CreateAppearanceController()
const createCoupleController = new CreateCoupleController()
const createDreamController = new CreateDreamController()
const createFearController = new CreateFearController()
const createObjectiveController = new CreateObjectiveController()
const createPersonalityController = new CreatePersonalityController()
const createPowerController = new CreatePowerController()
const createTraumaController = new CreateTraumaController()
const createValueController = new CreateValueController()
const createWisheController = new CreateWisheController()
const referenceAppearanceController = new ReferenceAppearanceController()
const referenceDreamController = new ReferenceDreamController()
const referenceFearsController = new ReferenceFearController()
const referenceObjectiveController = new ReferenceObjectiveController()
const referencePersonalityController = new ReferencePersonalityController()
const referencePowersController = new ReferencePowerController()
const referenceTraumaController = new ReferenceTraumaController()
const referenceValueController = new ReferenceValueController()
const referenceWishesController = new ReferenceWisheController()
const responseCommentPersonController = new ResponseCommentPersonController()

// PATH: api/persons
personsRoutesPost.post('/:projectId', createPersonController.handle)
personsRoutesPost.post(
  '/:personId/comments/objects/:toId',
  commentInPersonController.handle,
)
personsRoutesPost.post(
  '/:personId/comments/:commentId/responses',
  responseCommentPersonController.handle,
)
personsRoutesPost.post(
  '/:personId/appearances',
  createAppearanceController.handle,
)
personsRoutesPost.post('/:personId/couples', createCoupleController.handle)
personsRoutesPost.post('/:personId/dreams', createDreamController.handle)
personsRoutesPost.post('/:personId/fears', createFearController.handle)
personsRoutesPost.post(
  '/:personId/objectives',
  createObjectiveController.handle,
)
personsRoutesPost.post(
  '/:personId/personalities',
  createPersonalityController.handle,
)
personsRoutesPost.post('/:personId/powers', createPowerController.handle)
personsRoutesPost.post('/:personId/traumas', createTraumaController.handle)
personsRoutesPost.post('/:personId/values', createValueController.handle)
personsRoutesPost.post('/:personId/wishes', createWisheController.handle)
personsRoutesPost.post(
  '/:personId/appearances/references/:referenceId',
  referenceAppearanceController.handle,
)
personsRoutesPost.post(
  '/:personId/dreams/references/:referenceId',
  referenceDreamController.handle,
)
personsRoutesPost.post(
  '/:personId/fears/references/:referenceId',
  referenceFearsController.handle,
)
personsRoutesPost.post(
  '/:personId/objectives/references/:referenceId',
  referenceObjectiveController.handle,
)
personsRoutesPost.post(
  '/:personId/personalities/references/:referenceId',
  referencePersonalityController.handle,
)
personsRoutesPost.post(
  '/:personId/powers/references/:referenceId',
  referencePowersController.handle,
)
personsRoutesPost.post(
  '/:personId/traumas/references/:referenceId',
  referenceTraumaController.handle,
)
personsRoutesPost.patch(
  '/:personId/values/references/:referenceId',
  referenceValueController.handle,
)
personsRoutesPost.patch(
  '/:personId/wishes/references/:referenceId',
  referenceWishesController.handle,
)
