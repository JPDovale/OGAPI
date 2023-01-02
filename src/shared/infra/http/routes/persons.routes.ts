import { Router } from 'express'

import { CommentInPersonController } from '@modules/persons/useCases/commentInPerson/CommentInPersonController'
import { CreateAppearancesController } from '@modules/persons/useCases/createAppearance/CreateDreamsController'
import { CreateCouplesController } from '@modules/persons/useCases/createCouples/CreateCouplesController'
import { CreateDreamsController } from '@modules/persons/useCases/createDreams/CreateDreamsController'
import { CreateFearsController } from '@modules/persons/useCases/createFears/CreateFearsController'
import { CreateObjectivesController } from '@modules/persons/useCases/createObjectives/CreateObjectivesController'
import { CreatePersonController } from '@modules/persons/useCases/createPerson/CreatePersonController'
import { CreatePersonalityController } from '@modules/persons/useCases/createPersonality/CreatePersonalityController'
import { CreatePowersController } from '@modules/persons/useCases/createPowers/CreatePowersController'
import { CreateTraumaController } from '@modules/persons/useCases/createTraumas/CreateTraumasController'
import { CreateValuesController } from '@modules/persons/useCases/createValues/CreateValuesController'
import { CreateWishesController } from '@modules/persons/useCases/createWishes/CreateWishesController'
import { DeleteAppearanceController } from '@modules/persons/useCases/deleteAppearance/DeleteAppearanceController'
import { DeleteCoupleController } from '@modules/persons/useCases/deleteCouple/DeleteCoupleController'
import { DeleteDreamController } from '@modules/persons/useCases/deleteDream/DeleteDreamController'
import { DeleteFearController } from '@modules/persons/useCases/deleteFear/DeleteFearController'
import { DeleteObjectiveController } from '@modules/persons/useCases/deleteObjective/DeleteObjectiveController'
import { DeletePersonController } from '@modules/persons/useCases/deletePerson/DeletePersonController'
import { DeletePersonalityController } from '@modules/persons/useCases/deletePersonality/DeletePersonalityController'
import { DeletePowerController } from '@modules/persons/useCases/deletePower/DeletePowerController'
import { DeleteTraumaController } from '@modules/persons/useCases/deleteTrauma/DeleteTraumaController'
import { DeleteValuesController } from '@modules/persons/useCases/deleteValue/DeleteValueController'
import { DeleteWisheController } from '@modules/persons/useCases/deleteWishe/DeleteWisheController'
import { GetAllPersonsController } from '@modules/persons/useCases/getAllPersons/GetAllPersonsController'
import { ReferenceAppearanceController } from '@modules/persons/useCases/referenceAppearance/ReferenceAppearanceController'
import { ReferenceDreamController } from '@modules/persons/useCases/referenceDream/ReferenceDreamController'
import { ReferenceFearController } from '@modules/persons/useCases/referenceFear/ReferenceFearController'
import { ReferenceObjectiveController } from '@modules/persons/useCases/referenceObjective/ReferenceObjectiveController'
import { ReferencePersonalityController } from '@modules/persons/useCases/referencePersonality/ReferencePersonalityController'
import { ReferencePowerController } from '@modules/persons/useCases/referencePower/ReferencePowerController'
import { ReferenceTraumaController } from '@modules/persons/useCases/referenceTrauma/ReferenceTraumaController'
import { ReferenceValueController } from '@modules/persons/useCases/referenceValue/ReferenceValueController'
import { ReferenceWisheController } from '@modules/persons/useCases/referenceWishe/ReferenceFearController'
import { ResponseCommentPersonController } from '@modules/persons/useCases/responseCommentPerson/ResponseCommentPersonController'
import { UpdateAppearanceController } from '@modules/persons/useCases/updateAppearance/UpdateAppearanceController'
import { UpdateCoupleController } from '@modules/persons/useCases/updateCouple/UpdateFearController'
import { UpdateDreamController } from '@modules/persons/useCases/updateDream/UpdateDreamController'
import { UpdateFearController } from '@modules/persons/useCases/updateFear/UpdateFearController'
import { UpdateImagePersonController } from '@modules/persons/useCases/updateImagePerson/UpdateImagePersonController'
import { UpdateObjectiveController } from '@modules/persons/useCases/updateObjective/UpdateObjectiveController'
import { UpdatePersonController } from '@modules/persons/useCases/updatePerson/UpdatePersonController'
import { UpdatePersonalityController } from '@modules/persons/useCases/updatePersonality/UpdatePersonalityController'
import { UpdatePowerController } from '@modules/persons/useCases/updatePower/UpdatePowerController'
import { UpdateTraumaController } from '@modules/persons/useCases/updateTrauma/UpdateTraumaController'
import { UpdateValueController } from '@modules/persons/useCases/updateValue/UpdateValueController'
import { UpdateWisheController } from '@modules/persons/useCases/updateWishe/UpdateWisheController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { Uploads } from '../middlewares/upload'

export const personsRoutes = Router()

const createPersonController = new CreatePersonController()
const createObjectivesController = new CreateObjectivesController()
const referenceObjectiveController = new ReferenceObjectiveController()
const getAllPersonsController = new GetAllPersonsController()
const updatePersonController = new UpdatePersonController()
const deletePersonController = new DeletePersonController()
const deleteObjectiveController = new DeleteObjectiveController()
const updateObjectiveController = new UpdateObjectiveController()
const createPersonalityController = new CreatePersonalityController()
const referencePersonalityController = new ReferencePersonalityController()
const deletePersonalityController = new DeletePersonalityController()
const updatePersonalityController = new UpdatePersonalityController()
const createValuesController = new CreateValuesController()
const referenceValueController = new ReferenceValueController()
const deleteValuesController = new DeleteValuesController()
const updateValueController = new UpdateValueController()
const createDreamsController = new CreateDreamsController()
const referenceDreamController = new ReferenceDreamController()
const deleteDreamController = new DeleteDreamController()
const updateDreamController = new UpdateDreamController()
const createFearsController = new CreateFearsController()
const referenceFearsController = new ReferenceFearController()
const deleteFearsController = new DeleteFearController()
const updateFearsController = new UpdateFearController()
const createWishesController = new CreateWishesController()
const referenceWishesController = new ReferenceWisheController()
const deleteWishesController = new DeleteWisheController()
const updateWishesController = new UpdateWisheController()
const updateImagePersonController = new UpdateImagePersonController()
const commentInPersonController = new CommentInPersonController()
const responseCommentPersonController = new ResponseCommentPersonController()
const createAppearancesController = new CreateAppearancesController()
const referenceAppearanceController = new ReferenceAppearanceController()
const updateAppearanceController = new UpdateAppearanceController()
const deleteAppearanceController = new DeleteAppearanceController()
const createTraumaController = new CreateTraumaController()
const referenceTraumaController = new ReferenceTraumaController()
const deleteTraumaController = new DeleteTraumaController()
const updateTraumaController = new UpdateTraumaController()
const createPowersController = new CreatePowersController()
const referencePowersController = new ReferencePowerController()
const deletePowerController = new DeletePowerController()
const updatePowersController = new UpdatePowerController()
const createCouplesController = new CreateCouplesController()
const updateCouplesController = new UpdateCoupleController()
const deleteCoupleController = new DeleteCoupleController()

const uploads = new Uploads('persons', 'image')

personsRoutes.use(ensureAuthenticated)

personsRoutes.post('/', createPersonController.handle)
personsRoutes.get('/:projectId', getAllPersonsController.handle)
personsRoutes.patch('/', updatePersonController.handle)
personsRoutes.delete('/', deletePersonController.handle)
personsRoutes.patch(
  '/update-image/:personId',
  uploads.upload.single('file'),
  updateImagePersonController.handle,
)

personsRoutes.post('/objectives', createObjectivesController.handle)
personsRoutes.patch(
  '/objectives/reference',
  referenceObjectiveController.handle,
)
personsRoutes.patch('/objectives/delete', deleteObjectiveController.handle)
personsRoutes.patch('/objectives', updateObjectiveController.handle)

personsRoutes.post('/personality', createPersonalityController.handle)
personsRoutes.patch(
  '/personality/reference',
  referencePersonalityController.handle,
)
personsRoutes.patch('/personality/delete', deletePersonalityController.handle)
personsRoutes.patch('/personality', updatePersonalityController.handle)

personsRoutes.post('/values', createValuesController.handle)
personsRoutes.patch('/values/reference', referenceValueController.handle)
personsRoutes.patch('/values/delete', deleteValuesController.handle)
personsRoutes.patch('/values', updateValueController.handle)

personsRoutes.post('/dreams', createDreamsController.handle)
personsRoutes.patch('/dreams/reference', referenceDreamController.handle)
personsRoutes.patch('/dreams/delete', deleteDreamController.handle)
personsRoutes.patch('/dreams', updateDreamController.handle)

personsRoutes.post('/fears', createFearsController.handle)
personsRoutes.patch('/fears/reference', referenceFearsController.handle)
personsRoutes.patch('/fears/delete', deleteFearsController.handle)
personsRoutes.patch('/fears', updateFearsController.handle)

personsRoutes.post('/wishes', createWishesController.handle)
personsRoutes.patch('/wishes/reference', referenceWishesController.handle)
personsRoutes.patch('/wishes/delete', deleteWishesController.handle)
personsRoutes.patch('/wishes', updateWishesController.handle)

personsRoutes.post('/appearance', createAppearancesController.handle)
personsRoutes.patch(
  '/appearance/reference',
  referenceAppearanceController.handle,
)
personsRoutes.patch('/appearance/delete', deleteAppearanceController.handle)
personsRoutes.patch('/appearance', updateAppearanceController.handle)

personsRoutes.post('/traumas', createTraumaController.handle)
personsRoutes.patch('/traumas/reference', referenceTraumaController.handle)
personsRoutes.patch('/traumas/delete', deleteTraumaController.handle)
personsRoutes.patch('/traumas', updateTraumaController.handle)

personsRoutes.post('/powers', createPowersController.handle)
personsRoutes.patch('/powers/reference', referencePowersController.handle)
personsRoutes.patch('/powers/delete', deletePowerController.handle)
personsRoutes.patch('/powers', updatePowersController.handle)

personsRoutes.post('/couples', createCouplesController.handle)
personsRoutes.patch('/couples/delete', deleteCoupleController.handle)
personsRoutes.patch('/couples', updateCouplesController.handle)

personsRoutes.post('/comments', commentInPersonController.handle)
personsRoutes.post('/comments/response', responseCommentPersonController.handle)
