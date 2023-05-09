import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateWisheUseCase } from '@modules/persons/useCases/UpdateWisheUseCase'

export class UpdateWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateWisheParamsSchema = z.object({
      wisheId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateWisheBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, wisheId } = updateWisheParamsSchema.parse(req.params)
    const { title, description } = updateWisheBodySchema.parse(req.body)

    const updateWisheUseCase = container.resolve(UpdateWisheUseCase)
    const { wishe } = await updateWisheUseCase.execute({
      userId: id,
      personId,
      wisheId,
      description,
      title,
    })

    return res.status(200).json({ wishe })
  }
}
