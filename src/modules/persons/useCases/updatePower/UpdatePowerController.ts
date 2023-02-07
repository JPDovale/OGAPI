import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdatePowerUseCase } from './UpdatePowerUseCase'

export class UpdatePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePowerBodySchema = z.object({
      powerId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      power: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, powerId, power } = updatePowerBodySchema.parse(req.body)

    const updatePowerUseCase = container.resolve(UpdatePowerUseCase)
    const updatedPerson = await updatePowerUseCase.execute(
      id,
      personId,
      powerId,
      power,
    )

    return res.status(200).json(updatedPerson)
  }
}
