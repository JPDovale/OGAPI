import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateSceneUseCase } from './UpdateSceneUseCase'

export class UpdateSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateSceneBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      capituleId: z.string().min(6).max(100),
      sceneId: z.string().min(6).max(100),
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
      persons: z.array(z.string().min(6).max(100)).min(1),
      complete: z.boolean(),
      writtenWords: z.string().max(10).regex(/^\d+$/).optional(),
    })

    const { id } = req.user
    const {
      bookId,
      capituleId,
      objective,
      structure,
      persons,
      complete,
      sceneId,
      writtenWords,
    } = updateSceneBodySchema.parse(req.body)

    const updateSceneUseCase = container.resolve(UpdateSceneUseCase)
    const updatedBook = await updateSceneUseCase.execute({
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

    return res.status(200).json(updatedBook)
  }
}
