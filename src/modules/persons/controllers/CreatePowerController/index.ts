import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePowerUseCase } from '@modules/persons/useCases/CreatePowerUseCase'

export class CreatePowerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPowerParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createPowerBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { personId } = createPowerParamsSchema.parse(req.params)
    const { title, description } = createPowerBodySchema.parse(req.body)

    const createPowersUseCase = container.resolve(CreatePowerUseCase)
    const response = await createPowersUseCase.execute({
      userId: id,
      personId,
      title,
      description,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
