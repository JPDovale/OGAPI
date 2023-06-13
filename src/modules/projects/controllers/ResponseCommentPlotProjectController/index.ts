import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ResponseCommentPlotProjectUseCase } from '@modules/projects/useCases/ResponseCommentPlotProjectUseCase'

export class ResponseCommentPlotProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const responseCommentPlotProjectParamsSchema = z.object({
      projectId: z.string().uuid(),
      commentId: z.string().uuid(),
    })

    const responseCommentPlotProjectBodySchema = z.object({
      response: z
        .string()
        .max(2000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { commentId, projectId } =
      responseCommentPlotProjectParamsSchema.parse(req.params)
    const { response } = responseCommentPlotProjectBodySchema.parse(req.body)

    const responseCommentPlotProjectUseCase = container.resolve(
      ResponseCommentPlotProjectUseCase,
    )
    const responseUseCase = await responseCommentPlotProjectUseCase.execute({
      userId: id,
      projectId,
      commentId,
      response,
    })

    if (responseUseCase.error) {
      return res.status(responseUseCase.error.statusCode).json(responseUseCase)
    }

    return res.status(201).json(responseUseCase)
  }
}
