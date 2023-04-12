import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteCapituleUseCase } from '@modules/books/useCases/DeleteCapituleUseCase'

export class DeleteCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteCapituleParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId, capituleId } = deleteCapituleParamsSchema.parse(req.params)

    const deleteCapituleUseCase = container.resolve(DeleteCapituleUseCase)
    const { capitules, writtenWords } = await deleteCapituleUseCase.execute({
      userId: id,
      bookId,
      capituleId,
    })

    return res.status(200).json({ capitules, writtenWords })
  }
}
