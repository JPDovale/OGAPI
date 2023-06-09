import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserBookResponse } from '@modules/books/responses/parsers/ParserBookResponse'
import { CreateBookUseCase } from '@modules/books/useCases/CreateBookUseCase'

export class CreateBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createBookParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const createBookBodySchema = z.object({
      title: z.string().min(1).max(100),
      subtitle: z.string().max(100).optional(),
      authors: z.array(
        z.object({
          user_id: z.string().uuid(),
        }),
      ),
      literaryGenre: z.string().min(1).max(200),
      words: z.number().max(1000000).optional(),
      writtenWords: z.number().max(1000000).optional(),
      isbn: z.string().max(200).optional(),
    })

    const { id } = req.user
    const { projectId } = createBookParamsSchema.parse(req.params)
    const {
      title,
      subtitle,
      authors,
      literaryGenre,
      isbn,
      words,
      writtenWords,
    } = createBookBodySchema.parse(req.body)

    const createBookUseCase = container.resolve(CreateBookUseCase)
    const response = await createBookUseCase.execute({
      userId: id,
      projectId,
      title,
      subtitle,
      authors,
      literaryGenre,
      isbn,
      words,
      writtenWords,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    const parserBookResponse = container.resolve(ParserBookResponse)
    const responsePartied = parserBookResponse.parser(response)

    return res.status(responseStatusCode).json(responsePartied)
  }
}
