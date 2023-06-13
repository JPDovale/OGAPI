import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserCapituleResponse } from '@modules/books/responses/parsers/ParserCapituleResponse'
import { GetCapituleUseCase } from '@modules/books/useCases/GetCapituleUseCase'

export class GetCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetCapituleControllerParamsSchema = z.object({
      capituleId: z.string().uuid(),
    })

    const { id } = req.user
    const { capituleId } = GetCapituleControllerParamsSchema.parse(req.params)

    const getCapituleUseCase = container.resolve(GetCapituleUseCase)
    const response = await getCapituleUseCase.execute({
      capituleId,
      userId: id,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserCapituleResponse = container.resolve(ParserCapituleResponse)
    const responsePartied = parserCapituleResponse.parser(response)

    return res.status(responseStatusCode).json(responsePartied)
  }
}
