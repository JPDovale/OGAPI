import { Router } from 'express'

import { CreateTimeEventToDoController } from '@modules/timelines/controllers/CreateTimeEventToDoController'
import { CreateToDoTimeLineController } from '@modules/timelines/controllers/CreateToDoTimeLineController'

export const timeLinesRoutesPost = Router()

const createToDoTimeLineController = new CreateToDoTimeLineController()
const createTimeEventToDoController = new CreateTimeEventToDoController()

timeLinesRoutesPost.post('/todo', createToDoTimeLineController.handle)
timeLinesRoutesPost.post(
  '/todo/:timeLineId/timeEvents',
  createTimeEventToDoController.handle,
)
