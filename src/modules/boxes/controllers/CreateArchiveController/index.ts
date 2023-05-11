import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateArchiveUseCase } from '@modules/boxes/useCases/CrateArchiveUseCase'

export class CreateArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createArchiveParamsSchema = z.object({
      boxId: z.string().uuid(),
    })

    const createArchiveBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(600),
      filesImages: z
        .array(
          z.object({
            image_filename: z.string().min(1).max(200),
            image_url: z.string().url(),
          }),
        )
        .optional(),
    })

    const { id } = req.user
    const { boxId } = createArchiveParamsSchema.parse(req.params)
    const { description, title, filesImages } = createArchiveBodySchema.parse(
      req.body,
    )

    const createArchiveUseCase = container.resolve(CreateArchiveUseCase)
    const { archive } = await createArchiveUseCase.execute({
      userId: id,
      boxId,
      description,
      title,
      filesImages,
    })

    return res.status(201).json({ archive })
  }
}
