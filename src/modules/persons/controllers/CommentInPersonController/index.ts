import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CommentInPersonUseCase } from '@modules/persons/useCases/CommentInPersonUseCase'

export class CommentInPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const commentInPersonParamsSchema = z.object({
      personId: z.string().uuid(),
      toId: z.string().uuid(),
    })

    const commentInPersonBodySchema = z.object({
      content: z
        .string()
        .max(2000)
        .regex(/^[^<>{}\\]+$/),
      commentIn: z.enum([
        'appearance',
        'objective',
        'personality',
        'dream',
        'fear',
        'power',
        'couple',
        'value',
        'wishe',
        'trauma',
      ]),
    })

    const { id } = req.user
    const { personId, toId } = commentInPersonParamsSchema.parse(req.params)
    const { content, commentIn } = commentInPersonBodySchema.parse(req.body)

    const commentInPlotProjectUseCase = container.resolve(
      CommentInPersonUseCase,
    )
    const response = await commentInPlotProjectUseCase.execute({
      userId: id,
      personId,
      commentIn,
      content,
      toId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
