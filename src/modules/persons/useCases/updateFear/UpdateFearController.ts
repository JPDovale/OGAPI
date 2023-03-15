import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateFearUseCase } from './UpdateFearUseCase'

export class UpdateFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateFearBodySchema = z.object({
      fearId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      fear: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, fearId, fear } = updateFearBodySchema.parse(req.body)

    const updateFearUseCase = container.resolve(UpdateFearUseCase)
    const updatedPerson = await updateFearUseCase.execute(
      id,
      personId,
      fearId,
      fear,
    )

    return res.status(200).json(updatedPerson)
  }
}
