import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SetCompleteSceneUseCase } from '@modules/books/useCases/SetCompleteSceneUseCase'

export class SetCompleteSceneController {
  async handle(req: Request, res: Response): Promise<Response> {
    const setCompleteSceneParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
      sceneId: z.string().uuid(),
    })

    const setCompleteSceneBodySchema = z.object({
      writtenWords: z.number().max(100000),
    })

    const { id } = req.user
    const { bookId, capituleId, sceneId } = setCompleteSceneParamsSchema.parse(
      req.params,
    )
    const { writtenWords } = setCompleteSceneBodySchema.parse(req.body)

    const setCompleteSceneUseCase = container.resolve(SetCompleteSceneUseCase)
    const { bookWrittenWords, scene } = await setCompleteSceneUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      sceneId,
      writtenWords,
    })

    return res.status(200).json({ bookWrittenWords, scene })
  }
}
