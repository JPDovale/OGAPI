import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateValueUseCase } from '@modules/persons/useCases/CreateValueUseCase'

export class CreateValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createValueParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createValueBodySchema = z.object({
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
    })

    const { id } = req.user
    const { personId } = createValueParamsSchema.parse(req.params)
    const { title, description, exceptions } = createValueBodySchema.parse(
      req.body,
    )

    const createValuesUseCase = container.resolve(CreateValueUseCase)
    const response = await createValuesUseCase.execute({
      userId: id,
      personId,
      title,
      description,
      exceptions,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
