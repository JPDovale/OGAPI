import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetPersonalitiesUseCase } from '@modules/projects/useCases/GetPersonalitiesUseCase'

export class GetPersonalitiesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetPersonalitiesControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetPersonalitiesControllerParamsSchema.parse(
      req.params,
    )

    const getPersonalitiesUseCase = container.resolve(GetPersonalitiesUseCase)
    const { personalities } = await getPersonalitiesUseCase.execute({
      projectId,
      userId: id,
    })

    return res.status(200).json({ personalities })
  }
}
