import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateBoxUseCase } from './UpdateBoxUseCase'

export class UpdateBoxController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateBoxBodySchema = z.object({
      name: z.string().min(3).max(100).optional(),
      description: z.string().max(300).optional(),
      tags: z
        .array(
          z.object({
            name: z.string().min(3).max(100),
          }),
        )
        .optional(),
    })

    const updateBoxParamsSchema = z.object({
      boxId: z.string().min(6).max(100),
    })

    const { description, name, tags } = updateBoxBodySchema.parse(req.body)
    const { boxId } = updateBoxParamsSchema.parse(req.params)

    const updateBoxUseCase = container.resolve(UpdateBoxUseCase)
    const { box } = await updateBoxUseCase.execute({
      boxId,
      description,
      name,
      tags,
    })

    return res.status(200).json({ box })
  }
}
