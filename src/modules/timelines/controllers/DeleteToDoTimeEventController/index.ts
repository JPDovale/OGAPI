import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteTimeEventUseCase } from '@modules/timelines/useCases/DeleteTimeEventUseCase'

export class DeleteToDoTimeEventController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      timeLineId: z.string().uuid(),
      timeEventId: z.string().uuid(),
    })

    const { id } = req.user
    const { timeEventId, timeLineId } = reqParamsParser.parse(req.params)

    const deleteTimeEventUseCase = container.resolve(DeleteTimeEventUseCase)
    await deleteTimeEventUseCase.execute({
      userId: id,
      timeEventId,
      timeLineId,
    })

    return res.status(204).end()
  }
}
