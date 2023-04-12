import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateCapituleUseCase } from '@modules/books/useCases/CreateCapituleUseCase'

export class CreateCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCapituleParamsSchema = z.object({
      bookId: z.string().uuid(),
    })

    const createCapituleBodySchema = z.object({
      objective: z.string().min(1).max(600),
      name: z.string().min(1).max(600),
      structure: z
        .object({
          act1: z
            .string()
            .max(10000)
            .regex(/^[^<>{}\\]+$/)
            .optional(),
          act2: z
            .string()
            .max(10000)
            .regex(/^[^<>{}\\]+$/)
            .optional(),
          act3: z
            .string()
            .max(10000)
            .regex(/^[^<>{}\\]+$/)
            .optional(),
        })
        .optional(),
    })

    const { id } = req.user
    const { bookId } = createCapituleParamsSchema.parse(req.params)
    const { objective, structure, name } = createCapituleBodySchema.parse(
      req.body,
    )

    const createCapituleUseCase = container.resolve(CreateCapituleUseCase)
    const { capitule } = await createCapituleUseCase.execute({
      bookId,
      name,
      objective,
      structure: {
        act1: structure?.act1,
        act2: structure?.act2,
        act3: structure?.act3,
      },
      userId: id,
    })

    return res.status(201).json({ capitule })
  }
}
