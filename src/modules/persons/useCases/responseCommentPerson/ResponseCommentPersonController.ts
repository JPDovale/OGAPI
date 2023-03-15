import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ResponseCommentPersonUseCase } from './ResponseCommentPersonUseCase'

export class ResponseCommentPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const responseCommentPersonBodySchema = z.object({
      personId: z.string().min(6).max(100),
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
      personId,
      commentId,
      response: { content },
    } = responseCommentPersonBodySchema.parse(req.body)

    const responseCommentPersonUseCase = container.resolve(
      ResponseCommentPersonUseCase,
    )
    const person = await responseCommentPersonUseCase.execute(
      id,
      personId,
      commentId,
      { content },
    )

    return res.status(200).json(person)
  }
}
