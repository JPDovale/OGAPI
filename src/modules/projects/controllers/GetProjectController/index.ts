import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { GetProjectUseCase } from '@modules/projects/useCases/GetProjectUseCase'

export class GetProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const GetProjectControllerParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = GetProjectControllerParamsSchema.parse(req.params)

    const getProjectUseCase = container.resolve(GetProjectUseCase)
    const { project } = await getProjectUseCase.execute({
      projectId,
      userId: id,
    })

    return res.status(200).json({ project })
  }
}
