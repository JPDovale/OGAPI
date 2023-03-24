import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSceneUseCase } from './CreateSceneUseCase'

export class CreateSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createSceneBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      capituleId: z.string().min(6).max(100),
      objective: z.string().min(1).max(600),
      structure: z.object({
        act1: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
        act2: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
        act3: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
      }),
      persons: z.array(z.string().min(6).max(100)).min(1),
    })

    const { id } = req.user
    const { bookId, capituleId, objective, structure, persons } =
      createSceneBodySchema.parse(req.body)

    const createSceneUseCase = container.resolve(CreateSceneUseCase)
    const updatedBook = await createSceneUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      objective,
      structure,
      persons,
    })

    return res.status(201).json(updatedBook)
  }
}
