import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CommentInPlotProjectUseCase } from './CommentInPlotProjectUseCase'

export class CommentInPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const commentInPlotBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      comment: z.object({
        content: z
          .string()
          .max(2000)
          .regex(/^[^<>{}\\]+$/),
        to: z.string().min(6).max(100),
      }),
    })

    const { id } = req.user
    const {
      projectId,
      comment: { content, to },
    } = commentInPlotBodySchema.parse(req.body)

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPlotProjectUseCase,
    )
    const updatedProject = await commentInPlotProjectUseCase.execute(
      id,
      projectId,
      { content, to },
    )

    return res.status(200).json(updatedProject)
  }
}
