import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { QuitProjectUseCase } from '@modules/projects/useCases/QuitProjectUseCase'

export class QuitProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const quitProjectParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const { id } = req.user
    const { projectId } = quitProjectParamsSchema.parse(req.params)

    const quitProjectUseCase = container.resolve(QuitProjectUseCase)
    const response = await quitProjectUseCase.execute({ userId: id, projectId })

    if (response.error) {
      return res.status(response.error.statusCode).json(response)
    }

    return res.status(200).json(response)
  }
}
