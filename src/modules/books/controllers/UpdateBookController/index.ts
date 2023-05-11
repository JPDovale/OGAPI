import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateBookUseCase } from '@modules/books/useCases/UpdateBookUseCase'

export class UpdateBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateBookParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const updateBookBodySchema = z.object({
      title: z.string().max(100).optional(),
      subtitle: z.string().max(100).optional(),
      literaryGenere: z.string().max(200).optional(),
      words: z.number().max(1000000).optional(),
      isbn: z.string().max(200).optional(),
    })

    const { id } = req.user
    const { bookId } = updateBookParamsSchema.parse(req.params)
    const { title, subtitle, literaryGenere, words, isbn } =
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
