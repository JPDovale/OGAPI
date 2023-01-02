import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'

import { ResponseCommentPlotProjectUseCase } from './ResponseCommentPlotProjectUseCase'

export class ResponseCommentPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const response = req.body.response as IResponseCommentPlotProjectDTO
    const { projectId, commentId } = req.body

    const responseCommentPlotProjectUseCase = container.resolve(
      ResponseCommentPlotProjectUseCase,
    )
    const updatedProject = await responseCommentPlotProjectUseCase.execute(
      id,
      projectId,
      commentId,
      response,
    )

    return res.status(200).json(updatedProject)
  }
}
