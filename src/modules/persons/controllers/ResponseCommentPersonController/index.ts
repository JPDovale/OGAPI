import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ResponseCommentPersonUseCase } from '@modules/persons/useCases/ResponseCommentPersonUseCase'

export class ResponseCommentPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const responseCommentPersonParamsSchema = z.object({
      personId: z.string().uuid(),
      commentId: z.string().uuid(),
    })

    const responseCommentPersonBodySchema = z.object({
      content: z
        .string()
        .max(2000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { commentId, personId } = responseCommentPersonParamsSchema.parse(
      req.params,
    )
    const { content } = responseCommentPersonBodySchema.parse(req.body)

    const responseCommentPersonUseCase = container.resolve(
      ResponseCommentPersonUseCase,
    )
    const response = await responseCommentPersonUseCase.execute({
      userId: id,
      personId,
      commentId,
      content,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
