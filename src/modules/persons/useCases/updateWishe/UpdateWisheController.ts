import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateWisheUseCase } from './UpdateWisheUseCase'

export class UpdateWisheController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateWisheBodySchema = z.object({
      wisheId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      wishe: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, wisheId, wishe } = updateWisheBodySchema.parse(req.body)

    const updateWisheUseCase = container.resolve(UpdateWisheUseCase)
    const updatedPerson = await updateWisheUseCase.execute(
      id,
      personId,
      wisheId,
      wishe,
    )

    return res.status(200).json(updatedPerson)
  }
}
