import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { AddGenreUseCase } from '@modules/books/useCases/AddGenreUseCase'

export class AddGenreController {
  async handle(req: Request, res: Response): Promise<Response> {
    const addGenreParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const addGenreBodySchema = z.object({
      genre: z.string().min(1).max(150),
    })

    const { id } = req.user
    const { bookId } = addGenreParamsSchema.parse(req.params)
    const { genre } = addGenreBodySchema.parse(req.body)

    const addGenreUseCase = container.resolve(AddGenreUseCase)
    await addGenreUseCase.execute({
      userId: id,
      genre,
      bookId,
    })

    return res.status(201).end()
  }
}
