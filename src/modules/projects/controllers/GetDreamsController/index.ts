import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserPersonResponse } from '@modules/persons/responses/parsers/ParserPersonResponse'
import { GetDreamsUseCase } from '@modules/projects/useCases/GetDreamsUseCase'

export class GetDreamsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetDreamsControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetDreamsControllerParamsSchema.parse(req.params)

    const getDreamsUseCase = container.resolve(GetDreamsUseCase)
    const response = await getDreamsUseCase.execute({
      userId: id,
      projectId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    const parserPersonsResponse = container.resolve(ParserPersonResponse)
    const dreamsPartied = parserPersonsResponse.parserDreams(
      response.data?.dreams ?? [],
    )

    const responsePartied = {
      ok: response.ok,
      error: response.error,
      data: {
        dreams: dreamsPartied,
      },
    }
    return res.status(responseStatusCode).json(responsePartied)
  }
}
