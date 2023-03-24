import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SaveImageUseCase } from './SaveImageUseCase'

export class SaveImageController {
  async handle(req: Request, res: Response): Promise<Response> {
    const saveImagesParamsSchema = z.object({
      boxId: z.string().min(6).max(100),
      archiveId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { boxId, archiveId } = saveImagesParamsSchema.parse(req.params)
    const file = req.file

    const saveImageUseCase = container.resolve(SaveImageUseCase)
    const { box } = await saveImageUseCase.execute({
      archiveId,
      boxId,
      file,
      userId: id,
    })

    return res.status(200).json({ box })
  }
}
