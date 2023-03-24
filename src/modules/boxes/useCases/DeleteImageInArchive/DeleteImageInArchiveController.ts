import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteImageInArchiveUseCase } from './DeleteImageInArchiveUseCase'

export class DeleteImageInArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteImageInArchiveParamsSchema = z.object({
      boxId: z.string().min(6).max(100),
      archiveId: z.string().min(6).max(100),
      imageId: z.string().min(6).max(100),
    })

    const { archiveId, boxId, imageId } =
      deleteImageInArchiveParamsSchema.parse(req.params)

    const deleteImageInArchiveUseCase = container.resolve(
      DeleteImageInArchiveUseCase,
    )
    const { box } = await deleteImageInArchiveUseCase.execute({
      archiveId,
      boxId,
      imageId,
    })

    return res.status(200).json({ box })
  }
}
