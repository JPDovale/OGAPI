import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferencePersonalityUseCase } from './ReferencePersonalityUseCase'

export class ReferencePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referencePersonalityBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
      personality: z
        .object({
          consequences: z
            .array(
              z
                .object({
                  title: z.string().min(1).max(100),
                  description: z
                    .string()
                    .min(1)
                    .max(10000)
                    .regex(/^[^<>{}\\]+$/),
                })
                .optional(),
            )
            .optional(),
        })
        .optional(),
    })

    const { id } = req.user
    const {
      projectId,
      personId,
      refId,
      personality: { consequences },
    } = referencePersonalityBodySchema.parse(req.body)

    const referencePersonalityUseCase = container.resolve(
      ReferencePersonalityUseCase,
    )
    const { person, box } = await referencePersonalityUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      { consequences },
    )

    return res.status(200).json({ person, box })
  }
}
