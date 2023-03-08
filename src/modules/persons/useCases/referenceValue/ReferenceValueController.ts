import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ReferenceValueUseCase } from './ReferenceValueUseCase'

export class ReferenceValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const referenceValueBodySchema = z.object({
      personId: z.string().min(6).max(100),
      projectId: z.string().min(6).max(100),
      refId: z.string().min(6).max(100),
      value: z
        .object({
          exceptions: z
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
      value: { exceptions },
    } = referenceValueBodySchema.parse(req.body)

    const referenceValueUseCase = container.resolve(ReferenceValueUseCase)
    const { person, box } = await referenceValueUseCase.execute(
      id,
      projectId,
      personId,
      refId,
      { exceptions },
    )

    return res.status(200).json({ person, box })
  }
}
