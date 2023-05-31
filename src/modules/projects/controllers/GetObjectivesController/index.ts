import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

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

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
