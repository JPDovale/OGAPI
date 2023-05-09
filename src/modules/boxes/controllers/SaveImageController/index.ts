import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SaveImageUseCase } from '@modules/boxes/useCases/SaveImagesUseCase'

export class SaveImageController {
  async handle(req: Request, res: Response): Promise<Response> {
    const saveImagesParamsSchema = z.object({
      boxId: z.string().uuid(),
      archiveId: z.string().uuid(),
    })

    const { id } = req.user
    const { boxId, archiveId } = saveImagesParamsSchema.parse(req.params)
    const file = req.file

    const saveImageUseCase = container.resolve(SaveImageUseCase)
    const { image } = await saveImageUseCase.execute({
      archiveId,
      boxId,
      file,
      userId: id,
    })

    return res.status(201).json({ image })
  }
}
