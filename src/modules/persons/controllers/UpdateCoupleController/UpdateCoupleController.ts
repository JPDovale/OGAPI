import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateCoupleUseCase } from '@modules/persons/useCases/UpdateCoupleUseCase'

export class UpdateCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateCoupleParamsSchema = z.object({
      coupleId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateCoupleBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
      untilEnd: z.boolean().optional(),
    })

    const { id } = req.user
    const { coupleId, personId } = updateCoupleParamsSchema.parse(req.params)
    const { description, title, untilEnd } = updateCoupleBodySchema.parse(
      req.body,
    )

    const updateCoupleUseCase = container.resolve(UpdateCoupleUseCase)
    const { couple } = await updateCoupleUseCase.execute({
      userId: id,
      personId,
      coupleId,
      description,
      title,
      untilEnd,
    })

    return res.status(200).json({ couple })
  }
}
