import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdatePersonalityUseCase } from '@modules/persons/useCases/UpdatePersonalityUseCase'

export class UpdatePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePersonalityParamsSchema = z.object({
      personalityId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updatePersonalityBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, personalityId } = updatePersonalityParamsSchema.parse(
      req.params,
    )
    const { description, title } = updatePersonalityBodySchema.parse(req.body)

    const updatePersonalityUseCase = container.resolve(UpdatePersonalityUseCase)
    const { personality } = await updatePersonalityUseCase.execute({
      userId: id,
      personId,
      personalityId,
      description,
      title,
    })

    return res.status(200).json({ personality })
  }
}
