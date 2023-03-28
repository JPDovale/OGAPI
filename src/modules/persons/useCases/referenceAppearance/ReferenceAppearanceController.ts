import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceAppearanceUseCase } from './ReferenceAppearanceUseCase'

export class ReferenceAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceAppearanceBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId, personId, refId } = referenceAppearanceBodySchema.parse(
      req.body,
    )

    const referenceAppearanceUseCase = container.resolve(
      ReferenceAppearanceUseCase,
    )
    const { person, box } = await referenceAppearanceUseCase.execute(
      id,
      projectId,
      personId,
      refId,
    )

    return res.status(200).json({ person, box })
  }
}
