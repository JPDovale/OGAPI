import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateTraumaUseCase } from './UpdateTraumaUseCase'

export class UpdateTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateTraumaBodySchema = z.object({
      traumaId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      trauma: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, traumaId, trauma } = updateTraumaBodySchema.parse(
      req.body,
    )

    const updateTraumaUseCase = container.resolve(UpdateTraumaUseCase)
    const updatedPerson = await updateTraumaUseCase.execute(
      id,
      personId,
      traumaId,
      trauma,
    )

    return res.status(200).json(updatedPerson)
  }
}
