import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateDreamUseCase } from '@modules/persons/useCases/CreateDreamUseCase'

export class CreateDreamController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createDreamParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createDreamBodySchema = z.object({
      title: z.string().min(1).max(100),
      description: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
    })

    const { id } = req.user
    const { personId } = createDreamParamsSchema.parse(req.params)
    const { title, description } = createDreamBodySchema.parse(req.body)

    const createDreamUseCase = container.resolve(CreateDreamUseCase)
    const response = await createDreamUseCase.execute({
      userId: id,
      personId,
      title,
      description,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
