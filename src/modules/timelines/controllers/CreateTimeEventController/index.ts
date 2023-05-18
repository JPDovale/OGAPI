import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateTimeEventUseCase } from '@modules/timelines/useCases/CreateTimeEventUseCase'

export class CreateTimeEventController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createTimeEventParamsSchema = z.object({
      projectId: z.string().uuid(),
      timeLineId: z.string().uuid().optional(),
    })

    const createTimeEventBodySchema = z.object({
      happenedYear: z.coerce.number().max(1000000000000),
      happenedMonth: z.coerce.number().min(1).max(12),
      happenedDay: z.coerce.number().min(1).max(31),
      happenedHour: z.coerce.number().min(0).max(24).optional().nullable(),
      happenedMinute: z.coerce.number().min(0).max(60).optional().nullable(),
      happenedSecond: z.coerce.number().min(0).max(60).optional().nullable(),
      timeChrist: z.enum(['A.C.', 'D.C.']),
      title: z.string().min(2).max(160),
      description: z.string().min(2).max(600),
      importance: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
    })

    const { id } = req.user
    const { projectId, timeLineId } = createTimeEventParamsSchema.parse(
      req.params,
    )
    const {
      description,
      happenedDay,
      happenedMonth,
      happenedYear,
      importance,
      timeChrist,
      title,
      happenedHour,
      happenedMinute,
      happenedSecond,
    } = createTimeEventBodySchema.parse(req.body)

    const createTimeEventUseCase = container.resolve(CreateTimeEventUseCase)
    await createTimeEventUseCase.execute({
      description,
      happenedDay,
      happenedMonth: happenedMonth - 1,
      happenedYear,
      importance,
      timeChrist,
      title,
      happenedHour: happenedHour ?? 0,
      happenedMinute: happenedMinute ?? 0,
      happenedSecond: happenedSecond ?? 0,
      projectId,
      userId: id,
      timeLineId,
    })

    return res.status(201).end()
  }
}
