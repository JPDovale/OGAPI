import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceFearUseCase } from './ReferenceFearUseCase'

export class ReferenceFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceFearBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId, personId, refId } = referenceFearBodySchema.parse(
      req.body,
    )

    const referenceFeraUseCase = container.resolve(ReferenceFearUseCase)
    const { person, box } = await referenceFeraUseCase.execute(
      id,
      projectId,
      personId,
      refId,
    )

    return res.status(200).json({ person, box })
  }
}
