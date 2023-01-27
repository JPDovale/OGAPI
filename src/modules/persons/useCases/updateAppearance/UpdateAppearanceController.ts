import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateAppearanceUseCase } from './UpdateAppearanceUseCase'

export class UpdateAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateAppearanceBodySchema = z.object({
      appearanceId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      appearance: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, appearanceId, appearance } =
      updateAppearanceBodySchema.parse(req.body)

    const updateAppearanceUseCase = container.resolve(UpdateAppearanceUseCase)
    const updatedPerson = await updateAppearanceUseCase.execute(
      id,
      personId,
      appearanceId,
      appearance,
    )

    return res.status(200).json(updatedPerson)
  }
}
