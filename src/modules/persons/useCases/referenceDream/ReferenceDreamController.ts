import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceDreamUseCase } from './ReferenceDreamUseCase'

export class ReferenceDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceDreamBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId, personId, refId } = referenceDreamBodySchema.parse(
      req.body,
    )

    const referenceDreamUseCase = container.resolve(ReferenceDreamUseCase)
    const { person, box } = await referenceDreamUseCase.execute(
      id,
      projectId,
      personId,
      refId,
    )

    return res.status(200).json({ person, box })
  }
}
