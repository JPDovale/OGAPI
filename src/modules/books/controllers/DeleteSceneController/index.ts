import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteSceneUseCase } from '@modules/books/useCases/DeleteSceneUseCase'

export class DeleteSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteSceneParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
      sceneId: z.string().uuid(),
    })

    const { id } = req.user
    const { bookId, capituleId, sceneId } = deleteSceneParamsSchema.parse(
      req.params,
    )

    const deleteSceneUseCase = container.resolve(DeleteSceneUseCase)
    const { bookWrittenWords, capituleComplete, scenes } =
      await deleteSceneUseCase.execute({
        userId: id,
        capituleId,
        bookId,
        sceneId,
      })

    return res.status(200).json({ bookWrittenWords, capituleComplete, scenes })
  }
}
