import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReorderCapitulesUseCase } from '@modules/books/useCases/ReorderCapitulesUseCase'

export class ReorderCapitulesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reorderCapitulesParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const reorderCapitulesBodySchema = z.object({
      sequenceFrom: z.number().max(1000),
      sequenceTo: z.number().max(1000),
    })

    const { id } = req.user
    const { bookId } = reorderCapitulesParamsSchema.parse(req.params)
    const { sequenceFrom, sequenceTo } = reorderCapitulesBodySchema.parse(
      req.body,
    )

    const reorderCapitulesUseCase = container.resolve(ReorderCapitulesUseCase)
    const updatedBook = await reorderCapitulesUseCase.execute({
      userId: id,
      bookId,
      sequenceFrom,
      sequenceTo,
    })

    return res.status(200).json(updatedBook)
  }
}
