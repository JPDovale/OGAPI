import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateAppearanceUseCase } from '@modules/persons/useCases/UpdateAppearanceUseCase'

export class UpdateAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateAppearanceParamsSchema = z.object({
      appearanceId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateAppearanceBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { appearanceId, personId } = updateAppearanceParamsSchema.parse(
      req.params,
    )
    const { description, title } = updateAppearanceBodySchema.parse(req.body)

    const updateAppearanceUseCase = container.resolve(UpdateAppearanceUseCase)
    const { appearance } = await updateAppearanceUseCase.execute({
      userId: id,
      personId,
      appearanceId,
      description,
      title,
    })

    return res.status(200).json({ appearance })
  }
}
