import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateSceneUseCase } from '@modules/books/useCases/UpdateSceneUseCase'

export class UpdateSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateSceneParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
      sceneId: z.string().uuid(),
    })

    const updateSceneBodySchema = z.object({
      objective: z.string().max(600).optional(),
      structure: z.object({
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
      }),
      persons: z.array(z.string().uuid()).min(1),
      complete: z.boolean(),
      writtenWords: z.number().max(100000).optional(),
    })

    const { id } = req.user
    const { bookId, capituleId, sceneId } = updateSceneParamsSchema.parse(
      req.params,
    )
    const { objective, structure, persons, complete, writtenWords } =
      updateSceneBodySchema.parse(req.body)

    const updateSceneUseCase = container.resolve(UpdateSceneUseCase)
    const { bookWrittenWords, scene } = await updateSceneUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      objective,
      structure,
      persons,
      complete,
      sceneId,
      writtenWords,
    })

    return res.status(200).json({ bookWrittenWords, scene })
  }
}
