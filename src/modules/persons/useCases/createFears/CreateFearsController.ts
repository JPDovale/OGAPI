import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateFearUseCase } from './CreateFearsUseCase'

export class CreateFearsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createFearBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      fear: z.object({
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
      fear: { description, title },
    } = createFearBodySchema.parse(req.body)

    const createFearsUseCase = container.resolve(CreateFearUseCase)

    const { person, box } = await createFearsUseCase.execute({
      userId: id,
      projectId,
      personId,
      fear: {
        description,
        title,
      },
    })

    return res.status(201).json({ person, box })
  }
}
