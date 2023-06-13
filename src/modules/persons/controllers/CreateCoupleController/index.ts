import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateCoupleUseCase } from '@modules/persons/useCases/CreateCoupleUseCase'

export class CreateCoupleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCoupleParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createCoupleBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
      coupleId: z.string().uuid(),
      untilEnd: z.boolean(),
    })

    const { id } = req.user
    const { personId } = createCoupleParamsSchema.parse(req.params)
    const { title, description, coupleId, untilEnd } =
      createCoupleBodySchema.parse(req.body)

    const createCoupleUseCase = container.resolve(CreateCoupleUseCase)
    const response = await createCoupleUseCase.execute({
      userId: id,
      personId,
      title,
      description,
      untilEnd,
      coupleId,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
