import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetObjectivesUseCase } from '@modules/projects/useCases/GetObjectivesUseCase'

export class GetObjectivesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetObjectivesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetObjectivesControllerParamsSchema.parse(req.params)

    const getObjectivesUseCase = container.resolve(GetObjectivesUseCase)
    const response = await getObjectivesUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const objectivesPartied = parserPersonsResponse.parserObjectives(
      response.data?.objectives ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        objectives: objectivesPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
