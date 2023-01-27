import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CommentInPersonUseCase } from './CommentInPersonUseCase'

export class CommentInPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const commentInPersonBodySchema = z.object({
      personId: z.string().min(6).max(100),
      comment: z.object({
        content: z
          .string()
          .max(2000)
          .regex(/^[^<>{}\\]+$/),
        to: z.string().min(4).max(100),
      }),
    })

    const { id } = req.user
    const {
      personId,
      comment: { content, to },
    } = commentInPersonBodySchema.parse(req.body)

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPersonUseCase,
    )
    const person = await commentInPlotProjectUseCase.execute({
      userId: id,
      personId,
      comment: {
        content,
        to,
      },
    })

    return res.status(200).json(person)
  }
}
