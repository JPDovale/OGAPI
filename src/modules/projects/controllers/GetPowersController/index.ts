import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetPowersUseCase } from '@modules/projects/useCases/GetPowersUseCase'

export class GetPowersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetPowersControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetPowersControllerParamsSchema.parse(req.params)

    const getPowersUseCase = container.resolve(GetPowersUseCase)
    const response = await getPowersUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const powersPartied = parserPersonsResponse.parserPowers(
      response.data?.powers ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        powers: powersPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
