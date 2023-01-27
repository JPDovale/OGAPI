import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceTraumaUseCase } from './ReferenceTraumaUseCase'

export class ReferenceTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceTraumaBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
      trauma: z
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
      trauma: { consequences },
    } = referenceTraumaBodySchema.parse(req.body)

    const referenceTraumaUseCase = container.resolve(ReferenceTraumaUseCase)
    const personUpdated = await referenceTraumaUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      { consequences },
    )

    return res.status(200).json(personUpdated)
  }
}
