import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

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

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
