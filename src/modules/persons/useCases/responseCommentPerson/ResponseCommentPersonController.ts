import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IResponseCommentPlotProjectDTO } from '@modules/projects/dtos/IResponseCommentPlotProjectDTO'

import { ResponseCommentPersonUseCase } from './ResponseCommentPersonUseCase'

export class ResponseCommentPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const response = req.body.response as IResponseCommentPlotProjectDTO
    const { personId, commentId } = req.body

    const responseCommentPersonUseCase = container.resolve(
      ResponseCommentPersonUseCase,
    )
    const person = await responseCommentPersonUseCase.execute(
      id,
      personId,
      commentId,
      response,
    )

    return res.status(200).json(person)
  }
}
