import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UpdateValueUseCase } from '@modules/persons/useCases/UpdateValueUseCase'

export class UpdateValueController {
  async handle(req: Request, res: Response): Promise<Response> {
    const updateValueParamsSchema = z.object({
      valueId: z.string().uuid(),
      personId: z.string().uuid(),
    })

    const updateValueBodySchema = z.object({
      title: z.string().max(100).optional(),
      description: z
        .string()
        .max(10000)
        .regex(/^[^<>{}\\]+$/)
        .optional(),
    })

    const { id } = req.user
    const { personId, valueId } = updateValueParamsSchema.parse(req.params)
    const { description, title } = updateValueBodySchema.parse(req.body)

    const updateValueUseCase = container.resolve(UpdateValueUseCase)
    const { value } = await updateValueUseCase.execute({
      userId: id,
      personId,
      valueId,
      description,
      title,
    })

    return res.status(200).json({ value })
  }
}
