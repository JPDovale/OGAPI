import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReorderCapitulesUseCase } from './ReorderCapitulesUseCase'

export class ReorderCapitulesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reorderCapitulesBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      sequenceFrom: z.string().min(1).max(20),
      sequenceTo: z.string().min(1).max(20),
    })

    const { id } = req.user
    const { bookId, sequenceFrom, sequenceTo } =
      reorderCapitulesBodySchema.parse(req.body)

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
