import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdatePersonalityUseCase } from './UpdatePersonalityUseCase'

export class UpdatePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updatePersonalityBodySchema = z.object({
      personalityId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      personality: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
        consequences: z
          .array(
            z.object({
              title: z.string().min(1).max(100),
              description: z
                .string()
                .min(1)
                .max(10000)
                .regex(/^[^<>{}\\]+$/),
            }),
          )
          .optional(),
      }),
    })

    const { id } = req.user
    const { personId, personalityId, personality } =
      updatePersonalityBodySchema.parse(req.body)

    const updatePersonalityUseCase = container.resolve(UpdatePersonalityUseCase)
    const updatedPerson = await updatePersonalityUseCase.execute(
      id,
      personId,
      personalityId,
      personality,
    )

    return res.status(200).json(updatedPerson)
  }
}
