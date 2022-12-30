import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICommentPlotProjectDTO } from '@modules/projects/dtos/ICommentPlotProjectDTO'

import { CommentInPersonUseCase } from './CommentInPersonUseCase'

export class CommentInPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const comment = req.body.comment as ICommentPlotProjectDTO
    const personId = req.body.personId

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPersonUseCase,
    )
    await commentInPlotProjectUseCase.execute(id, personId, comment)

    return res.status(200).json()
  }
}
