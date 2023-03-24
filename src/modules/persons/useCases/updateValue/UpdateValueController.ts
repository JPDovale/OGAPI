import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateValueUseCase } from './UpdateValueUseCase'

export class UpdateValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateValueBodySchema = z.object({
      valueId: z.string().min(6).max(100),
      personId: z.string().min(6).max(100),
      value: z.object({
        title: z.string().max(100).optional(),
        description: z
          .string()
          .max(10000)
          .regex(/^[^<>{}\\]+$/)
          .optional(),
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
    const { personId, valueId, value } = updateValueBodySchema.parse(req.body)

    const updateValueUseCase = container.resolve(UpdateValueUseCase)
    const updatedPerson = await updateValueUseCase.execute(
      id,
      personId,
      valueId,
      value,
    )

    return res.status(200).json(updatedPerson)
  }
}
