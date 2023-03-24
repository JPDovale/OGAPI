import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteArchiveUseCase } from './DeleteArchiveUseCase'

export class DeleteArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteArchiveParamsSchema = z.object({
      boxId: z.string().min(6).max(100),
      archiveId: z.string().min(6).max(100),
    })

    const { archiveId, boxId } = deleteArchiveParamsSchema.parse(req.params)

    const deleteArchiveUseCase = container.resolve(DeleteArchiveUseCase)
    const { box } = await deleteArchiveUseCase.execute({
      archiveId,
      boxId,
    })

    return res.status(200).json({ box })
  }
}
