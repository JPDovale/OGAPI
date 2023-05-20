import { Router } from 'express'

import { DeleteToDoTimeEventController } from '@modules/timelines/controllers/DeleteToDoTimeEventController'

export const timeLinesRoutesDelete = Router()

const deleteToDoTimeEventController = new DeleteToDoTimeEventController()

timeLinesRoutesDelete.delete(
  '/todo/:timeLineId/timeEvents/:timeEventId',
  deleteToDoTimeEventController.handle,
)
