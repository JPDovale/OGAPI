import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePersonalityUseCase } from './CreatePersonalityUseCase'

export class CreatePersonalityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPersonalityBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      personality: z.object({
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
      }),
    })

    const { id } = req.user
    const {
      projectId,
      personId,
      personality: { title, description, consequences },
    } = createPersonalityBodySchema.parse(req.body)

    const createPersonalityUseCase = container.resolve(CreatePersonalityUseCase)
    const updatedPerson = await createPersonalityUseCase.execute({
      userId: id,
      projectId,
      personId,
      personality: {
        title,
        description,
        consequences,
      },
    })

    return res.status(201).json(updatedPerson)
  }
}
