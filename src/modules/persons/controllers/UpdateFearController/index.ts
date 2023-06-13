import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateFearUseCase } from '@modules/persons/useCases/UpdateFearUseCase'

export class UpdateFearController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateFearParamsSchema = z.object({
      fearId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateFearBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, fearId } = updateFearParamsSchema.parse(req.params)
    const { title, description } = updateFearBodySchema.parse(req.body)

    const updateFearUseCase = container.resolve(UpdateFearUseCase)
    const response = await updateFearUseCase.execute({
      userId: id,
      personId,
      fearId,
      description,
      title,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
