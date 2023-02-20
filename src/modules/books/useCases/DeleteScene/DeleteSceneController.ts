import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteSceneUseCase } from './DeleteSceneUseCase'

export class DeleteSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteSceneBodySchema = z.object({
      bookId: z.string().min(6).max(100),
      capituleId: z.string().min(6).max(100),
      sceneId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { bookId, capituleId, sceneId } = deleteSceneBodySchema.parse(
      req.params,
    )

    const deleteSceneUseCase = container.resolve(DeleteSceneUseCase)
    const updatedBook = await deleteSceneUseCase.execute({
      userId: id,
      capituleId,
      bookId,
      sceneId,
    })

    return res.status(200).json(updatedBook)
  }
}
