import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateCoupleUseCase } from './CreateCouplesUseCase'

export class CreateCouplesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCoupleBodySchema = z.object({
      projectId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      couple: z.object({
        title: z.string().min(1).max(100),
        description: z
          .string()
          .min(1)
          .max(10000)
          .regex(/^[^<>{}\\]+$/),
        personId: z.string().min(6).max(100),
        final: z.boolean(),
      }),
    })

    const { id } = req.user
    const {
      projectId,
      personId,
      couple: { title, description, final, personId: couplePersonId },
    } = createCoupleBodySchema.parse(req.body)

    const createCouplesUseCase = container.resolve(CreateCoupleUseCase)

    const updatedPersons = await createCouplesUseCase.execute({
      userId: id,
      projectId,
      personId,
      couple: {
        title,
        description,
        final,
        personId: couplePersonId,
      },
    })

    return res.status(201).json(updatedPersons)
  }
}
