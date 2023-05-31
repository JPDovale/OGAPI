import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CopyTimeLineToProjectUseCase } from '@modules/projects/useCases/CopyTimeLineToProjectUseCase'

export class CopyTimeLineToProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const reqParamsParser = z.object({
      projectId: z.string().uuid(),
      timeLineId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId, timeLineId } = reqParamsParser.parse(req.params)

    const copyTimeLineToProjectUseCase = container.resolve(
      CopyTimeLineToProjectUseCase,
    )
    const response = await copyTimeLineToProjectUseCase.execute({
      userId: id,
      projectId,
      timeLineId,
    })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(201).json(response)
  }
}
