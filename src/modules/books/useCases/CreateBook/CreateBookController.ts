import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateBookUseCase } from './CreateBookUseCase'

export class CreateBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createBookBodySchema = z.object({
      title: z.string().min(1).max(100),
      subtitle: z.string().max(100).optional(),
      authors: z.array(
        z.object({
          username: z.string().min(1).max(60),
          email: z.string().email().max(100),
          id: z.string().min(6).max(100),
        }),
      ),
      literaryGenere: z.string().min(1).max(200),
      words: z.string().min(1).max(20).regex(/^\d+$/).optional(),
      writtenWords: z.string().min(1).max(20).regex(/^\d+$/).optional(),
      generes: z
        .array(
          z.object({
            name: z.string().min(1).max(150),
          }),
        )
        .min(1)
        .max(6),
      isbn: z.string().max(200).optional(),
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const {
      projectId,
      title,
      subtitle,
      authors,
      literaryGenere,
      generes,
      isbn,
      words,
      writtenWords,
    } = createBookBodySchema.parse(req.body)

    const createBookUseCase = container.resolve(CreateBookUseCase)
    const newBook = await createBookUseCase.execute({
      userId: id,
      projectId,
      title,
      subtitle,
      authors,
      literaryGenere,
      generes,
      isbn,
      words,
      writtenWords,
    })

    return res.status(200).json(newBook)
  }
}