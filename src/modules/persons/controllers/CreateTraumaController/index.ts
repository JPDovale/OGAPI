import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateTraumaUseCase } from '@modules/persons/useCases/CreateTraumaUseCase'

export class CreateTraumaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createTraumaParamsSchema = z.object({
      personId: z.string().uuid(),
    })

    const createTraumaBodySchema = z.object({
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
    })

    const { id } = req.user
    const { personId } = createTraumaParamsSchema.parse(req.params)
    const { title, description, consequences } = createTraumaBodySchema.parse(
      req.body,
    )

    const createTraumaUseCase = container.resolve(CreateTraumaUseCase)
    const response = await createTraumaUseCase.execute({
      userId: id,
      personId,
      title,
      description,
      consequences,
    })
    const responseStatusCode = response.error ? response.error.statusCode : 201

    return res.status(responseStatusCode).json(response)
  }
}
