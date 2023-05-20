import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateTimeEventToDoUseCase } from '@modules/timelines/useCases/CreateTimeEventToDoUseCase'

export class CreateTimeEventToDoController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createTimeEventParamsSchema = z.object({
      timeLineId: z.string().uuid(),
    })

    const createTimeEventBodySchema = z.object({
      happenedYear: z.coerce.number().max(1000000000000),
      happenedMonth: z.coerce.number().min(1).max(12),
      happenedDay: z.coerce.number().min(1).max(31),
      happenedHour: z.coerce.number().min(0).max(24).optional().nullable(),
      happenedMinute: z.coerce.number().min(0).max(60).optional().nullable(),
      happenedSecond: z.coerce.number().min(0).max(60).optional().nullable(),
      title: z.string().min(2).max(160),
      description: z.string().min(2).max(600),
    })

    const { id } = req.user
    const { timeLineId } = createTimeEventParamsSchema.parse(req.params)

    const {
      description,
      happenedDay,
      happenedMonth,
      happenedYear,
      title,
      happenedHour,
      happenedMinute,
      happenedSecond,
    } = createTimeEventBodySchema.parse(req.body)

    const createTimeEventToDoUseCase = container.resolve(
      CreateTimeEventToDoUseCase,
    )
    await createTimeEventToDoUseCase.execute({
      timeLineId,
      description,
      happenedDay,
      happenedMonth: happenedMonth - 1,
      happenedYear,
      title,
      happenedHour: happenedHour ?? 0,
      happenedMinute: happenedMinute ?? 0,
      happenedSecond: happenedSecond ?? 0,
      userId: id,
    })

    return res.status(201).end()
  }
}
