import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetFearsUseCase } from '@modules/projects/useCases/GetFearsUseCase'

export class GetFearsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetFearsControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetFearsControllerParamsSchema.parse(req.params)

    const getFearsUseCase = container.resolve(GetFearsUseCase)
    const response = await getFearsUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const fearsPartied = parserPersonsResponse.parserFears(
      response.data?.fears ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        fears: fearsPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
