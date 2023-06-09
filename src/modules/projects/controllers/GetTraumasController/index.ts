import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetTraumasUseCase } from '@modules/projects/useCases/GetTraumasUseCase'

export class GetTraumasController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetTraumasControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetTraumasControllerParamsSchema.parse(req.params)

    const getTraumasUseCase = container.resolve(GetTraumasUseCase)
    const response = await getTraumasUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const traumasPartied = parserPersonsResponse.parserTraumas(
      response.data?.traumas ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        traumas: traumasPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
