import { Router } from 'express'

import { GetPersonController } from '@modules/persons/controllers/GetPersonController'

export const personsRoutesGet = Router()

const getPersonController = new GetPersonController()

personsRoutesGet.get('/:personId', getPersonController.handle)
