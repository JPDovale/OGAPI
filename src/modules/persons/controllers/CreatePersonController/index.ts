import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreatePersonUseCase } from '@modules/persons/useCases/CreatePersonUseCase'

export class CreatePersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPersonParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const createPersonBodySchema = z.object({
      name: z.string().min(1).max(60),
      lastName: z.string().min(1).max(60),
      history: z
        .string()
        .min(1)
        .max(10000)
        .regex(/^[^<>{}\\]+$/),
      age: z.number().nullable(),
      bornMonth: z.coerce.number().max(12),
      bornDay: z.coerce.number().max(31),
      bornHour: z.coerce.number().max(24),
      bornMinute: z.coerce.number().max(60),
      bornSecond: z.coerce.number().max(60),
    })

    const { id } = req.user
    const { projectId } = createPersonParamsSchema.parse(req.params)
    const {
      age,
      history,
      lastName,
      name,
      bornDay,
      bornHour,
      bornMinute,
      bornMonth,
      bornSecond,
    } = createPersonBodySchema.parse(req.body)

    const createPersonUseCase = container.resolve(CreatePersonUseCase)
    const { person } = await createPersonUseCase.execute({
      userId: id,
      projectId,
      age,
      name,
      lastName,
      history,
      bornDay,
      bornHour,
      bornMinute,
      bornMonth: bornMonth - 1, // month is received like  1 -> 12 in name months respective, but when logical is Applied the months transformed to format 0 -> 12 in respective names
      bornSecond,
    })

    return res.status(201).json({ person })
  }
}
