import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetValuesUseCase } from '@modules/projects/useCases/GetValuesUseCase'

export class GetValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetValuesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetValuesControllerParamsSchema.parse(req.params)

    const getValuesUseCase = container.resolve(GetValuesUseCase)
    const response = await getValuesUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const valuesPartied = parserPersonsResponse.parserValues(
      response.data?.values ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        values: valuesPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
