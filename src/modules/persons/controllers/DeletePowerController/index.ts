import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeletePowerUseCase } from '@modules/persons/useCases/DeletePowerUseCase'

export class DeletePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePowerParamsSchema = z.object({
      personId: z.string().uuid(),
      powerId: z.string().uuid(),
    })

    const { id } = req.user
    const { personId, powerId } = deletePowerParamsSchema.parse(req.params)

    const deletePowerUseCase = container.resolve(DeletePowerUseCase)
    await deletePowerUseCase.execute({
      userId: id,
      personId,
      powerId,
    })

    return res.status(204).end()
  }
}
