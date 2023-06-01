import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetPersonalitiesUseCase } from '@modules/projects/useCases/GetPersonalitiesUseCase'

export class GetPersonalitiesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetPersonalitiesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetPersonalitiesControllerParamsSchema.parse(
      req.params,
    )

    const getPersonalitiesUseCase = container.resolve(GetPersonalitiesUseCase)
    const response = await getPersonalitiesUseCase.execute({
      projectId,
      userId: id,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const personalitiesPartied = parserPersonsResponse.parserPersonalities(
      response.data?.personalities ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        personalities: personalitiesPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
