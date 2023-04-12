import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteImageInArchiveUseCase } from '@modules/boxes/useCases/DeleteImageInArchiveUseCase'

export class DeleteImageInArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteImageInArchiveParamsSchema = z.object({
      boxId: z.string().uuid(),
      archiveId: z.string().uuid(),
      imageId: z.string().uuid(),
    })

    const { id } = req.user
    const { archiveId, boxId, imageId } =
      deleteImageInArchiveParamsSchema.parse(req.params)

    const deleteImageInArchiveUseCase = container.resolve(
      DeleteImageInArchiveUseCase,
    )
    await deleteImageInArchiveUseCase.execute({
      archiveId,
      boxId,
      imageId,
      userId: id,
    })

    return res.status(204).end()
  }
}
