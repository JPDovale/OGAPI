import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteBookUseCase } from '@modules/books/useCases/DeleteBookUseCase'

export class DeleteBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteBookParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId } = deleteBookParamsSchema.parse(req.params)

    const deleteBookUseCase = container.resolve(DeleteBookUseCase)
    await deleteBookUseCase.execute({
      userId: id,
      bookId,
    })

    return res.status(204).end()
  }
}
