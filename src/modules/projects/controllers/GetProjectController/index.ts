import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ParserProjectResponse } from '@modules/projects/responses/parsers/ParserProjectResponse'
import { GetProjectUseCase } from '@modules/projects/useCases/GetProjectUseCase'

export class GetProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetProjectControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetProjectControllerParamsSchema.parse(req.params)

    const getProjectUseCase = container.resolve(GetProjectUseCase)
    const response = await getProjectUseCase.execute({
      projectId,
      userId: id,
    })

    const parserProjectResponse = container.resolve(ParserProjectResponse)
    const responsePartied = parserProjectResponse.parser(response)

    if (response.error) {
      return res.status(response.error.statusCode).json(responsePartied)
    }

    return res.status(200).json(responsePartied)
  }
}
