import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateTraumaUseCase } from '@modules/persons/useCases/UpdateTraumaUseCase'

export class UpdateTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateTraumaParamsSchema = z.object({
      traumaId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateTraumaBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, traumaId } = updateTraumaParamsSchema.parse(req.params)
    const { description, title } = updateTraumaBodySchema.parse(req.body)

    const updateTraumaUseCase = container.resolve(UpdateTraumaUseCase)
    const { trauma } = await updateTraumaUseCase.execute({
      userId: id,
      personId,
      traumaId,
      description,
      title,
    })

    return res.status(200).json({ trauma })
  }
}
