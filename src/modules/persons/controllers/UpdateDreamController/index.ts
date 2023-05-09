import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateDreamUseCase } from '@modules/persons/useCases/UpdateDreamUseCase'

export class UpdateDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateDreamParamsSchema = z.object({
      dreamId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateDreamBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, dreamId } = updateDreamParamsSchema.parse(req.params)
    const { description, title } = updateDreamBodySchema.parse(req.body)

    const updateDreamUseCase = container.resolve(UpdateDreamUseCase)
    const { dream } = await updateDreamUseCase.execute({
      userId: id,
      personId,
      dreamId,
      description,
      title,
    })

    return res.status(200).json({ dream })
  }
}
