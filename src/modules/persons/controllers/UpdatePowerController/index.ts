import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdatePowerUseCase } from '@modules/persons/useCases/UpdatePowerUseCase'

export class UpdatePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePowerParamsSchema = z.object({
      powerId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updatePowerBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, powerId } = updatePowerParamsSchema.parse(req.params)
    const { description, title } = updatePowerBodySchema.parse(req.body)

    const updatePowerUseCase = container.resolve(UpdatePowerUseCase)
    const { power } = await updatePowerUseCase.execute({
      userId: id,
      personId,
      powerId,
      description,
      title,
    })

    return res.status(200).json({ power })
  }
}
