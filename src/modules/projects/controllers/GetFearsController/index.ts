import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

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

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
