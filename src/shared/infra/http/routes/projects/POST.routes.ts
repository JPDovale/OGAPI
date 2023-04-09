import { Router } from 'express'

import { CommentInPlotProjectController } from '@modules/projects/controllers/CommentInPlotProjectController'
import { CreateProjectController } from '@modules/projects/controllers/CreateProjectUseCase'
import { ResponseCommentPlotProjectController } from '@modules/projects/controllers/ResponseCommentPlotProjectController'

export const projectsRoutesPost = Router()

const createProjectController = new CreateProjectController()
const commentInPlotProjectController = new CommentInPlotProjectController()
const responseCommentPlotProject = new ResponseCommentPlotProjectController()

projectsRoutesPost.post('/', createProjectController.handle)
projectsRoutesPost.post(
  '/:projectId/plot/comments',
  commentInPlotProjectController.handle,
)
projectsRoutesPost.post(
  '/:projectId/plot/comments/:commentId/responses',
  responseCommentPlotProject.handle,
)
