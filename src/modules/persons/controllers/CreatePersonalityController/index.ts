import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePersonalityUseCase } from '@modules/persons/useCases/CreatePersonalityUseCase'

export class CreatePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPersonalityParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createPersonalityBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
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
    })

    const { id } = req.user
    const { personId } = createPersonalityParamsSchema.parse(req.params)
    const { title, description, consequences } =
      createPersonalityBodySchema.parse(req.body)

    const createPersonalityUseCase = container.resolve(CreatePersonalityUseCase)
    const { personality } = await createPersonalityUseCase.execute({
      userId: id,
      personId,
      title,
      description,
      consequences,
    })

    return res.status(201).json({ personality })
  }
}
