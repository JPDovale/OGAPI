import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateCoupleUseCase } from './UpdateCoupleUseCase'

export class UpdateCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateCoupleBodySchema = z.object({
      coupleId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      couple: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, coupleId, couple } = updateCoupleBodySchema.parse(
      req.body,
    )

    const updateCoupleUseCase = container.resolve(UpdateCoupleUseCase)
    const updatedPerson = await updateCoupleUseCase.execute(
      id,
      personId,
      coupleId,
      couple,
    )

    return res.status(200).json(updatedPerson)
  }
}
