import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateValueUseCase } from './CreateValuesUseCase'

export class CreateValuesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createValueBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      value: z.object({
        title: z.string().min(1).max(100),
        description: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
        exceptions: z
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
      value: { title, description, exceptions },
    } = createValueBodySchema.parse(req.body)

    const createValuesUseCase = container.resolve(CreateValueUseCase)
    const { person, box } = await createValuesUseCase.execute({
      userId: id,
      projectId,
      personId,
      value: {
        title,
        description,
        exceptions,
      },
    })

    return res.status(201).json({ person, box })
  }
}
