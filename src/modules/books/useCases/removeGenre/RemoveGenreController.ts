import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RemoveGenreUseCase } from './RemoveGenreUseCase'

export class RemoveGenreController {
  async handle(req: Request, res: Response): Promise<Response> {
    const removeGenreBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      genre: z.string().min(1).max(150),
    })

    const { id } = req.user
    const { genre, bookId } = removeGenreBodySchema.parse(req.body)

    const removeGenreUseCase = container.resolve(RemoveGenreUseCase)
    const updatedBook = await removeGenreUseCase.execute({
      userId: id,
      genre,
      bookId,
    })

    return res.status(200).json({ book: updatedBook })
  }
}
