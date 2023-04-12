import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteArchiveUseCase } from '@modules/boxes/useCases/DeleteArchiveUseCase'

export class DeleteArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deleteArchiveParamsSchema = z.object({
      boxId: z.string().uuid(),
      archiveId: z.string().uuid(),
    })

    const { id } = req.user
    const { archiveId, boxId } = deleteArchiveParamsSchema.parse(req.params)

    const deleteArchiveUseCase = container.resolve(DeleteArchiveUseCase)
    await deleteArchiveUseCase.execute({
      archiveId,
      boxId,
      userId: id,
    })

    return res.status(204).end()
  }
}
