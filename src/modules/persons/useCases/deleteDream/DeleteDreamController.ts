import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteDreamUseCase } from './DeleteDreamUseCase'

export class DeleteDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteDreamBodySchema = z.object({
      personId: z.string().min(6).max(100),
      dreamId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, dreamId } = deleteDreamBodySchema.parse(req.body)

    const deleteDreamUseCase = container.resolve(DeleteDreamUseCase)
    const { person, box } = await deleteDreamUseCase.execute(
      id,
      personId,
      dreamId,
    )

    return res.status(200).json({ person, box })
  }
}
