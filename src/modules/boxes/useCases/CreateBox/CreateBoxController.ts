import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateBoxUseCase } from './CreateBoxUseCase'

interface ICreateBoxBodyType {
  name: string
  description?: string
  tags?: Array<{ name: string }>
}

export class CreateBoxController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createBoxBodySchema = z.object({
      name: z.string().min(3).max(100),
      description: z.string().max(300).optional(),
      tags: z
        .array(
          z.object({
            name: z.string().min(3).max(100),
          }),
        )
        .optional(),
    })

    const { id } = req.user
    const { name, tags, description } = createBoxBodySchema.parse(
      req.body,
    ) as ICreateBoxBodyType

    const createBoxUseCase = container.resolve(CreateBoxUseCase)
    const { box } = await createBoxUseCase.execute({
      name,
      tags,
      userId: id,
      description,
    })

    return res.status(201).json({ box })
  }
}
