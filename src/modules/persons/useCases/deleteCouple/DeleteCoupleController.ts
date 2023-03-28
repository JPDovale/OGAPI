import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteCoupleUseCase } from './DeleteCoupleUseCase'

export class DeleteCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteCoupleBodySchema = z.object({
      personId: z.string().min(6).max(100),
      coupleId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, coupleId } = deleteCoupleBodySchema.parse(req.body)

    const deleteCoupleUseCase = container.resolve(DeleteCoupleUseCase)
    const { person, couple } = await deleteCoupleUseCase.execute(
      id,
      personId,
      coupleId,
    )

    return res.status(200).json({ person, couple })
  }
}
