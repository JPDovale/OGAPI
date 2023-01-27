import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePowerUseCase } from './CreatePowersUseCase'

export class CreatePowersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPowerBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      power: z.object({
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
      power: { title, description },
    } = createPowerBodySchema.parse(req.body)

    const createPowersUseCase = container.resolve(CreatePowerUseCase)

    const { person, project } = await createPowersUseCase.execute({
      userId: id,
      projectId,
      personId,
      power: {
        title,
        description,
      },
    })

    return res.status(201).json({ person, project })
  }
}
