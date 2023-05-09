import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetTraumasUseCase } from '@modules/projects/useCases/GetTraumasUseCase'

export class GetTraumasController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetTraumasControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetTraumasControllerParamsSchema.parse(req.params)

    const getTraumasUseCase = container.resolve(GetTraumasUseCase)
    const { traumas } = await getTraumasUseCase.execute({
      userId: id,
      projectId,
    })

    return res.status(200).json({ traumas })
  }
}
