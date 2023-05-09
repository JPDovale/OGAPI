import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RemoveFrontCoverUseCase } from '@modules/books/useCases/RemoveFrontCoverUseCase'

export class RemoveFrontCoverController {
  async handle(req: Request, res: Response): Promise<Response> {
    const removeFrontCoverParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId } = removeFrontCoverParamsSchema.parse(req.params)

    const removeFrontCoverUseCase = container.resolve(RemoveFrontCoverUseCase)
    await removeFrontCoverUseCase.execute({
      bookId,
      userId: id,
    })

    return res.status(204).end()
  }
}
