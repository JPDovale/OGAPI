import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { AddGenreUseCase } from './AddGenreUseCase'

export class AddGenreController {
  async handle(req: Request, res: Response): Promise<Response> {
    const addGenreBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      genre: z.string().min(1).max(150),
    })

    const { id } = req.user
    const { genre, bookId } = addGenreBodySchema.parse(req.body)

    const addGenreUseCase = container.resolve(AddGenreUseCase)
    const updatedBook = await addGenreUseCase.execute({
      userId: id,
      genre,
      bookId,
    })

    return res.status(200).json({ book: updatedBook })
  }
}
