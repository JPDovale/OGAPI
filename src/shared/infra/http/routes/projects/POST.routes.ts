import { Router } from 'express'

import { CommentInPlotProjectController } from '@modules/projects/controllers/CommentInPlotProjectController'
import { CopyTimeLineToProjectController } from '@modules/projects/controllers/CopyTimeLineToProjectController'
import { CreateProjectController } from '@modules/projects/controllers/CreateProjectController'
import { ResponseCommentPlotProjectController } from '@modules/projects/controllers/ResponseCommentPlotProjectController'
import { CreateTimeEventController } from '@modules/timelines/controllers/CreateTimeEventController'

export const projectsRoutesPost = Router()

const createProjectController = new CreateProjectController()
const commentInPlotProjectController = new CommentInPlotProjectController()
const responseCommentPlotProject = new ResponseCommentPlotProjectController()
const createTimeEventController = new CreateTimeEventController()
const copyTimeLineToProjectController = new CopyTimeLineToProjectController()

// PATH: api/projects
projectsRoutesPost.post('/', createProjectController.handle)
projectsRoutesPost.post(
  '/:projectId/plot/comments',
  commentInPlotProjectController.handle,
)
projectsRoutesPost.post(
  '/:projectId/plot/comments/:commentId/responses',
  responseCommentPlotProject.handle,
)
projectsRoutesPost.post(
  '/:projectId/timelines/timeEvents',
  createTimeEventController.handle,
)
projectsRoutesPost.post(
  '/:projectId/timelines/:timeLineId/copy',
  copyTimeLineToProjectController.handle,
)
