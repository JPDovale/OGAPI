import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateCapituleUseCase } from '@modules/books/useCases/UpdateCapituleUseCase'

export class UpdateCapituleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateCapituleParamsSchema = z.object({
      bookId: z.string().uuid(),
      capituleId: z.string().uuid(),
    })

    const updateCapituleBodySchema = z.object({
      objective: z.string().max(600).optional(),
      name: z.string().max(600).optional(),
      structure: z
        .object({
          act1: z
            .string()
            .max(10000)
            .regex(/^[^<>{}\\]+$/)
            .optional(),
          act2: z
            .string()
            .max(10000)
            .regex(/^[^<>{}\\]+$/)
            .optional(),
          act3: z
            .string()
            .max(10000)
            .regex(/^[^<>{}\\]+$/)
            .optional(),
        })
        .optional(),
    })

    const { id } = req.user
    const { bookId, capituleId } = updateCapituleParamsSchema.parse(req.params)
    const { name, objective, structure } = updateCapituleBodySchema.parse(
      req.body,
    )

    const updateCapituleUseCase = container.resolve(UpdateCapituleUseCase)
    const response = await updateCapituleUseCase.execute({
      userId: id,
      bookId,
      capituleId,
      name,
      objective,
      structure: {
        act1: structure?.act1,
        act2: structure?.act2,
        act3: structure?.act3,
      },
    })

    const responseStatusCode = response.error ? response.error.statusCode : 200

    return res.status(responseStatusCode).json(response)
  }
}
