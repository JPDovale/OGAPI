import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateWisheUseCase } from './CreateWishesUseCase'

export class CreateWishesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createWisheBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      wishe: z.object({
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
      wishe: { title, description },
    } = createWisheBodySchema.parse(req.body)

    const createWishesUseCase = container.resolve(CreateWisheUseCase)

    const { person, box } = await createWishesUseCase.execute({
      userId: id,
      projectId,
      personId,
      wishe: {
        title,
        description,
      },
    })

    return res.status(201).json({ person, box })
  }
}
