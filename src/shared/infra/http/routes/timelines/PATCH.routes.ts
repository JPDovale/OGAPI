import { Router } from 'express'

import { ChangeDoneToDoEventController } from '@modules/timelines/controllers/ChangeDoneToDoEventController'

export const timeLinesRoutesPatch = Router()

const changeDoneToDoEventController = new ChangeDoneToDoEventController()

timeLinesRoutesPatch.patch(
  '/:timeLineId/todo/:projectId/timeEvents/:timeEventId',
  changeDoneToDoEventController.handle,
)
