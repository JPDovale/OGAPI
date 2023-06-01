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
    const response = await deleteCapituleUseCase.execute({
      userId: id,
      bookId,
      capituleId,
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
