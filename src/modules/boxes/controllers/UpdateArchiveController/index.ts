import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateArchiveUseCase } from '@modules/boxes/useCases/UpdateArchiveUseCase'

export class UpdateArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateArchiveParamsSchema = z.object({
      boxId: z.string().uuid(),
      archiveId: z.string().uuid(),
    })

    const updateArchiveBodySchema = z.object({
      title: z.string().min(1).max(100).optional(),
      description: z.string().min(1).max(600).optional(),
    })

    const { id } = req.user
    const { title, description } = updateArchiveBodySchema.parse(req.body)
    const { archiveId, boxId } = updateArchiveParamsSchema.parse(req.params)

    const updateArchiveUseCase = container.resolve(UpdateArchiveUseCase)
    const { archive } = await updateArchiveUseCase.execute({
      archiveId,
      boxId,
      title,
      description,
      userId: id,
    })

    return res.status(200).json({ archive })
  }
}
