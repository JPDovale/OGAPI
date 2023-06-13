import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RemoveGenreUseCase } from '@modules/books/useCases/RemoveGenreUseCase'

export class RemoveGenreController {
  async handle(req: Request, res: Response): Promise<Response> {
    const removeGenreParamsSchema = z.object({
      bookId: z.string().uuid(),
      genreId: z.string().uuid(),
    })

    const { id } = req.user
    const { genreId, bookId } = removeGenreParamsSchema.parse(req.params)

    const removeGenreUseCase = container.resolve(RemoveGenreUseCase)
    const response = await removeGenreUseCase.execute({
      userId: id,
      genreId,
      bookId,
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
