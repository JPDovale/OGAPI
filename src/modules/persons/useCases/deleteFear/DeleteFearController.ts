import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteFearUseCase } from './DeleteFearUseCase'

export class DeleteFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteFearBodySchema = z.object({
      personId: z.string().min(6).max(100),
      fearId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { personId, fearId } = deleteFearBodySchema.parse(req.body)

    const deleteFearUseCase = container.resolve(DeleteFearUseCase)
    const { person, box } = await deleteFearUseCase.execute(
      id,
      personId,
      fearId,
    )

    return res.status(200).json({ person, box })
  }
}
