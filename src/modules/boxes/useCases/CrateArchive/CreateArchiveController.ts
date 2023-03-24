import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateArchiveUseCase } from './CreateArchiveUseCase'

export class CreateArchiveController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createArchiveBodySchema = z.object({
      boxId: z.string().min(6).max(100),
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(600),
      filesImages: z
        .array(
          z.object({
            fileName: z.string().min(1).max(200),
            url: z.string().url(),
            createdAt: z.string().min(1).max(100),
            updatedAt: z.string().min(1).max(100),
          }),
        )
        .optional(),
    })

    const { id } = req.user
    const { boxId, description, title, filesImages } =
      createArchiveBodySchema.parse(req.body)

    const createArchiveUseCase = container.resolve(CreateArchiveUseCase)
    const { box } = await createArchiveUseCase.execute({
      userId: id,
      boxId,
      description,
      title,
      filesImages,
    })

    return res.status(201).json({ box })
  }
}
