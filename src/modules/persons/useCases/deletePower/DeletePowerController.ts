import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeletePowerUseCase } from './DeletePowerUseCase'

export class DeletePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePowerBodySchema = z.object({
      personId: z.string().min(6).max(100),
      powerId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, powerId } = deletePowerBodySchema.parse(req.body)

    const deletePowerUseCase = container.resolve(DeletePowerUseCase)
    const { person, box } = await deletePowerUseCase.execute(
      id,
      personId,
      powerId,
    )

    return res.status(200).json({ person, box })
  }
}
