import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceObjectiveUseCase } from './ReferenceObjectiveUseCase'

export class ReferenceObjectiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceObjectiveBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
      objective: z
        .object({
          objectified: z.boolean().optional(),
          avoiders: z.array(z.string().min(6).max(100)).optional(),
          supporting: z.array(z.string().min(6).max(100)).optional(),
        })
        .optional(),
    })

    const { id } = req.user
    const {
      projectId,
      personId,
      refId,
      objective: { avoiders, objectified, supporting },
    } = referenceObjectiveBodySchema.parse(req.body)

    const referenceObjectiveUseCase = container.resolve(
      ReferenceObjectiveUseCase,
    )
    const { person, box } = await referenceObjectiveUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      {
        avoiders,
        supporting,
        objectified,
      },
    )

    return res.status(200).json({ person, box })
  }
}
