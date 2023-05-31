import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

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

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
