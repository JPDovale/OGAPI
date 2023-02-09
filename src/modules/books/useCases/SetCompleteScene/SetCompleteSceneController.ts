import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SetCompleteSceneUseCase } from './SetCompleteSceneUseCase'

export class SetCompleteSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const setCompleteSceneBookSchema = z.object({
      bookId: z.string().min(6).max(100),
      capituleId: z.string().min(6).max(100),
      sceneId: z.string().min(6).max(100),
      writtenWords: z.string().min(1).max(10).regex(/^\d+$/),
    })

    const { id } = req.user
    const { bookId, capituleId, sceneId, writtenWords } =
      setCompleteSceneBookSchema.parse(req.body)

    const setCompleteSceneUseCase = container.resolve(SetCompleteSceneUseCase)
    const updatedBook = await setCompleteSceneUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      sceneId,
      writtenWords,
    })

    return res.status(200).json(updatedBook)
  }
}
