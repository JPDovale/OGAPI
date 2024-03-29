import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReorderScenesUseCase } from '@modules/books/useCases/ReorderScenesUseCase'

export class ReorderScenesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reorderScenesParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
    })

    const reorderScenesBodySchema = z.object({
      sequenceFrom: z.number().max(1000),
      sequenceTo: z.number().max(1000),
    })

    const { id } = req.user
    const { bookId, capituleId } = reorderScenesParamsSchema.parse(req.params)
    const { sequenceFrom, sequenceTo } = reorderScenesBodySchema.parse(req.body)

    const reorderScenesUseCase = container.resolve(ReorderScenesUseCase)
    const response = await reorderScenesUseCase.execute({
      userId: id,
      capituleId,
      bookId,
      sequenceFrom,
      sequenceTo,
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
