import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReorderScenesUseCase } from './ReorderScenesUseCase'

export class ReorderScenesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reorderScenesBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      capituleId: z.string().min(6).max(100),
      sequenceFrom: z.string().min(1).max(20),
      sequenceTo: z.string().min(1).max(20),
    })

    const { id } = req.user
    const { bookId, capituleId, sequenceFrom, sequenceTo } =
      reorderScenesBodySchema.parse(req.body)

    const reorderScenesUseCase = container.resolve(ReorderScenesUseCase)
    const updatedBook = await reorderScenesUseCase.execute({
      userId: id,
      capituleId,
      bookId,
      sequenceFrom,
      sequenceTo,
    })

    return res.status(200).json(updatedBook)
  }
}
