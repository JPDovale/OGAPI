import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateCapituleUseCase } from './UpdateCapituleUseCase'

export class UpdateCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateCapituleBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      capituleId: z.string().min(6).max(100),
      objective: z.string().max(600).optional(),
      name: z.string().max(600).optional(),
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
    const {
      bookId,
      capituleId,
      name,
      objective,
      structure: { act1, act2, act3 },
    } = updateCapituleBodySchema.parse(req.body)

    const updateCapituleUseCase = container.resolve(UpdateCapituleUseCase)
    const updatedBook = await updateCapituleUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      name,
      objective,
      structure: {
        act1,
        act2,
        act3,
      },
    })

    return res.status(200).json(updatedBook)
  }
}
