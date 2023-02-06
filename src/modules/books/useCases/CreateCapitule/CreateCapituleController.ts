import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateCapituleUseCase } from './CreateCapituleUseCase'

export class CreateCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCapituleBodySchema = z.object({
      bookId: z.string().min(6).max(100),
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
    const { bookId, objective, structure, name } =
      createCapituleBodySchema.parse(req.body)

    const createCapituleUseCase = container.resolve(CreateCapituleUseCase)
    const updatedBook = await createCapituleUseCase.execute({
      bookId,
      name,
      objective,
      structure,
      userId: id,
    })

    return res.status(201).json(updatedBook)
  }
}
