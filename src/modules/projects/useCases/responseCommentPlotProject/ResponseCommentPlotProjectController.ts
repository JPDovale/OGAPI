import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ResponseCommentPlotProjectUseCase } from './ResponseCommentPlotProjectUseCase'

export class ResponseCommentPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const responseCommentPlotProjectBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      commentId: z.string().min(6).max(100),
      response: z.object({
        content: z
          .string()
          .max(2000)
          .regex(/^[^<>{}\\]+$/),
      }),
    })

    const { id } = req.user
    const {
      projectId,
      commentId,
      response: { content },
    } = responseCommentPlotProjectBodySchema.parse(req.body)

    const responseCommentPlotProjectUseCase = container.resolve(
      ResponseCommentPlotProjectUseCase,
    )
    const updatedProject = await responseCommentPlotProjectUseCase.execute(
      id,
      projectId,
      commentId,
      { content },
    )

    return res.status(200).json(updatedProject)
  }
}
