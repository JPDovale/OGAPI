import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { QuitProjectUseCase } from './QuitProjectUseCase'
export class QuitProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const quitProjectBodySchema = z.object({
      projectId: z.string().min(6).max(100),
    })

    const { id } = req.user
    const { projectId } = quitProjectBodySchema.parse(req.body)

    const quitProjectUseCase = container.resolve(QuitProjectUseCase)
    await quitProjectUseCase.execute({ userId: id, projectId })

    return res.status(200).end()
  }
}
