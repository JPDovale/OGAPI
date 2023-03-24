import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateArchiveUseCase } from './UpdateArchiveUseCase'

export class UpdateArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateArchiveBodySchema = z.object({
      title: z.string().min(1).max(100).optional(),
      description: z.string().min(1).max(600).optional(),
    })

    const updateArchiveParamsSchema = z.object({
      boxId: z.string().min(6).max(100),
      archiveId: z.string().min(6).max(100),
    })

    const { title, description } = updateArchiveBodySchema.parse(req.body)
    const { archiveId, boxId } = updateArchiveParamsSchema.parse(req.params)

    const updateArchiveUseCase = container.resolve(UpdateArchiveUseCase)
    const { box } = await updateArchiveUseCase.execute({
      archiveId,
      boxId,
      title,
      description,
    })

    return res.status(200).json({ box })
  }
}
