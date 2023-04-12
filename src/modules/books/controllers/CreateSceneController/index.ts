import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSceneUseCase } from '@modules/books/useCases/CreateSceneUseCase'

export class CreateSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createSceneParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
    })

    const createSceneBodySchema = z.object({
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
      persons: z
        .array(
          z.object({
            id: z.string().uuid(),
          }),
        )
        .min(1),
    })

    const { id } = req.user
    const { bookId, capituleId } = createSceneParamsSchema.parse(req.params)
    const { objective, structure, persons } = createSceneBodySchema.parse(
      req.body,
    )

    const createSceneUseCase = container.resolve(CreateSceneUseCase)
    const { scene } = await createSceneUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      objective,
      structure,
      persons,
    })

    return res.status(201).json({ scene })
  }
}
