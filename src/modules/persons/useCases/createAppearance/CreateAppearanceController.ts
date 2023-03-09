import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateAppearanceUseCase } from './CreateAppearanceUseCase'

export class CreateAppearancesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createAppearanceBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      appearance: z.object({
        title: z.string().min(1).max(100),
        description: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
      }),
    })

    const { id } = req.user
    const {
      projectId,
      personId,
      appearance: { description, title },
    } = createAppearanceBodySchema.parse(req.body)

    const createAppearanceUseCase = container.resolve(CreateAppearanceUseCase)

    const { person, box } = await createAppearanceUseCase.execute({
      userId: id,
      projectId,
      personId,
      appearance: {
        title,
        description,
      },
    })

    return res.status(201).json({ person, box })
  }
}
