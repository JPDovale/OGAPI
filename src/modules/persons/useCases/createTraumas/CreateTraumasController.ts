import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateTraumaUseCase } from './CreateTraumasUseCase'

export class CreateTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createTraumaBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      trauma: z.object({
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
      trauma: { title, description, consequences },
    } = createTraumaBodySchema.parse(req.body)

    const createTraumaUseCase = container.resolve(CreateTraumaUseCase)
    const { person, box } = await createTraumaUseCase.execute({
      userId: id,
      projectId,
      personId,
      trauma: {
        title,
        description,
        consequences,
      },
    })

    return res.status(201).json({ person, box })
  }
}
