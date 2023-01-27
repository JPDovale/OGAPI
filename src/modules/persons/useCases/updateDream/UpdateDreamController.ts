import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateDreamUseCase } from './UpdateDreamUseCase'

export class UpdateDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateDreamBodySchema = z.object({
      dreamId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      dream: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, dreamId, dream } = updateDreamBodySchema.parse(req.body)

    const updateDreamUseCase = container.resolve(UpdateDreamUseCase)
    const updatedPerson = await updateDreamUseCase.execute(
      id,
      personId,
      dreamId,
      dream,
    )

    return res.status(200).json(updatedPerson)
  }
}
