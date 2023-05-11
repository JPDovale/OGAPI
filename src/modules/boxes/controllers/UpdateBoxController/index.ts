import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateBoxUseCase } from '@modules/boxes/useCases/UpdateBoxUseCase'

export class UpdateBoxController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateBoxParamsSchema = z.object({
      boxId: z.string().uuid(),
    })

    const updateBoxBodySchema = z.object({
      name: z.string().min(3).max(100).optional(),
      description: z.string().max(300).optional(),
    })

    const { id } = req.user
    const { boxId } = updateBoxParamsSchema.parse(req.params)
    const { description, name } = updateBoxBodySchema.parse(req.body)

    const updateBoxUseCase = container.resolve(UpdateBoxUseCase)
    const { box } = await updateBoxUseCase.execute({
      boxId,
      description,
      name,
      userId: id,
    })

    return res.status(200).json({ box })
  }
}
