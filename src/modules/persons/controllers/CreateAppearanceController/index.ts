import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateAppearanceUseCase } from '@modules/persons/useCases/CreateAppearanceUseCase'

export class CreateAppearanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createAppearanceParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createAppearanceBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { personId } = createAppearanceParamsSchema.parse(req.params)
    const { description, title } = createAppearanceBodySchema.parse(req.body)

    const createAppearanceUseCase = container.resolve(CreateAppearanceUseCase)
    const { appearance } = await createAppearanceUseCase.execute({
      userId: id,
      personId,
      title,
      description,
    })

    return res.status(201).json({ appearance })
  }
}
