import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetPersonUseCase } from '@modules/persons/useCases/GetPersonUseCase'

export class GetPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetPersonControllerParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId } = GetPersonControllerParamsSchema.parse(req.params)

    const getPersonUseCase = container.resolve(GetPersonUseCase)
    const response = await getPersonUseCase.execute({
      personId,
      userId: id,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonResponse = container.resolve(ParserPersonResponse)
    const responsePartied = parserPersonResponse.parser(response)

    return res.status(responseStatusCode).json(responsePartied)
  }
}
