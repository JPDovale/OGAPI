import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CommentInPlotProjectUseCase } from '@modules/projects/useCases/CommentInPlotProjectUseCase'

export class CommentInPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const commentInPlotProjectParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const commentInPlotProjectBodySchema = z.object({
      content: z
        .string()
        .max(2000)
        .regex(/^[^<>{}\\]+$/),
      to: z
        .string()
        .max(300)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { projectId } = commentInPlotProjectParamsSchema.parse(req.params)
    const { content, to } = commentInPlotProjectBodySchema.parse(req.body)

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPlotProjectUseCase,
    )
    const { comment } = await commentInPlotProjectUseCase.execute({
      userId: id,
      projectId,
      content,
      to,
    })

    return res.status(200).json({ comment })
  }
}
