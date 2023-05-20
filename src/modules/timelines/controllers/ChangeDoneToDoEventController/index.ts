import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ChangeDoneToDoEventUseCase } from '@modules/timelines/useCases/ChangeDoneToDoEventUseCase'

export class ChangeDoneToDoEventController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      projectId: z.string().uuid(),
      timeLineId: z.string().uuid(),
      timeEventId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId, timeEventId, timeLineId } = reqParamsParser.parse(
      req.params,
    )

    const changeDoneToDoEventUseCase = container.resolve(
      ChangeDoneToDoEventUseCase,
    )
    await changeDoneToDoEventUseCase.execute({
      userId: id,
      projectId,
      timeEventId,
      timeLineId,
    })

    return res.status(204).end()
  }
}
