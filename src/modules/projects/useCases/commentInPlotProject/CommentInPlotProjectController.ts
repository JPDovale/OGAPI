import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'

import { CommentInPlotProjectUseCase } from './CommentInPlotProjectUseCase'

export class CommentInPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const comment = req.body.comment as ICommentPlotProjectDTO
    const projectId = req.body.projectId

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPlotProjectUseCase,
    )
    const updatedProject = await commentInPlotProjectUseCase.execute(
      id,
      projectId,
      comment,
    )

    return res.status(200).json(updatedProject)
  }
}
