import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetPowersUseCase } from '@modules/projects/useCases/GetPowersUseCase'

export class GetPowersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetPowersControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetPowersControllerParamsSchema.parse(req.params)

    const getPowersUseCase = container.resolve(GetPowersUseCase)
    const { powers } = await getPowersUseCase.execute({
      userId: id,
      projectId,
    })

    return res.status(200).json({ powers })
  }
}
