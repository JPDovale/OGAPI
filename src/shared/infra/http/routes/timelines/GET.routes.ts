import { Router } from 'express'

import { GetTodoTimeLinesController } from '@modules/timelines/controllers/GetTodoTimeLinesController'

export const timeLinesRoutesGet = Router()

const getTodoTimeLinesController = new GetTodoTimeLinesController()

timeLinesRoutesGet.get('/todo', getTodoTimeLinesController.handle)
