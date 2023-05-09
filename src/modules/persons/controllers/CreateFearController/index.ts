import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateFearUseCase } from '@modules/persons/useCases/CreateFearUseCase'

export class CreateFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createFearParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createFearBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { personId } = createFearParamsSchema.parse(req.params)
    const { description, title } = createFearBodySchema.parse(req.body)

    const createFearUseCase = container.resolve(CreateFearUseCase)

    const { fear } = await createFearUseCase.execute({
      userId: id,
      personId,
      description,
      title,
    })

    return res.status(201).json({ fear })
  }
}
