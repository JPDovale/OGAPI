import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetAppearancesUseCase } from '@modules/projects/useCases/GetAppearancesUseCase'

export class GetAppearancesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetAppearancesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetAppearancesControllerParamsSchema.parse(req.params)

    const getAppearancesUseCase = container.resolve(GetAppearancesUseCase)
    const response = await getAppearancesUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const appearancesPartied = parserPersonsResponse.parserAppearances(
      response.data?.appearances ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        appearances: appearancesPartied,
      },
    }

    return res.status(responseStatusCode).json(responsePartied)
  }
}
