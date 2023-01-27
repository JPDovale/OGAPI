import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferencePowerUseCase } from './ReferencePowerUseCase'

export class ReferencePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referencePowerBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId, personId, refId } = referencePowerBodySchema.parse(
      req.body,
    )

    const referenceFeraUseCase = container.resolve(ReferencePowerUseCase)
    const personUpdated = await referenceFeraUseCase.execute(
      id,
      projectId,
      personId,
      refId,
    )

    return res.status(200).json(personUpdated)
  }
}
