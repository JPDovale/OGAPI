import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateBookUseCase } from './UpdateBookUseCase'

export class UpdateBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateBookBodySchema = z.object({
      title: z.string().max(100).optional(),
      subtitle: z.string().max(100).optional(),
      literaryGenere: z.string().max(200).optional(),
      words: z.string().max(20).regex(/^\d+$/).optional(),
      isbn: z.string().max(200).optional(),
      bookId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { title, subtitle, literaryGenere, words, isbn, bookId } =
      updateBookBodySchema.parse(req.body)

    const updateBookUseCase = container.resolve(UpdateBookUseCase)
    const updatedBook = await updateBookUseCase.execute({
      userId: id,
      literaryGenere,
      title,
      subtitle,
      words,
      isbn,
      bookId,
    })

    return res.status(200).json({ book: updatedBook })
  }
}
