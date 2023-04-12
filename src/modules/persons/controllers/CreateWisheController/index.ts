import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateWisheUseCase } from '@modules/persons/useCases/CreateWisheUseCase'

export class CreateWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createWisheParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createWisheBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { personId } = createWisheParamsSchema.parse(req.params)
    const { title, description } = createWisheBodySchema.parse(req.body)

    const createWishesUseCase = container.resolve(CreateWisheUseCase)
    const { wishe } = await createWishesUseCase.execute({
      userId: id,
      personId,
      title,
      description,
    })

    return res.status(201).json({ wishe })
  }
}
