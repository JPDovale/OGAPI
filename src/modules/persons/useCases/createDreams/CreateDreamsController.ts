import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateDreamUseCase } from './CreateDreamsUseCase'

export class CreateDreamsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createDreamBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      dream: z.object({
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
      personId,
      projectId,
      dream: { title, description },
    } = createDreamBodySchema.parse(req.body)

    const createDreamsUseCase = container.resolve(CreateDreamUseCase)
    const { person, box } = await createDreamsUseCase.execute({
      userId: id,
      projectId,
      personId,
      dream: {
        title,
        description,
      },
    })

    return res.status(201).json({ person, box })
  }
}
