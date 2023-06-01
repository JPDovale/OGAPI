import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserBookResponse } from '@modules/books/responses/parsers/ParserBookResponse'
import { GetBookUseCase } from '@modules/books/useCases/GetBookUseCase'

export class GetBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetBookControllerParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId } = GetBookControllerParamsSchema.parse(req.params)

    const getBookUseCase = container.resolve(GetBookUseCase)
    const response = await getBookUseCase.execute({
      bookId,
      userId: id,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserBookResponse = container.resolve(ParserBookResponse)
    const responsePartied = parserBookResponse.parser(response)

    return res.status(responseStatusCode).json(responsePartied)
  }
}
