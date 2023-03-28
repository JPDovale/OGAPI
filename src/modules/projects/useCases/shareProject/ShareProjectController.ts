import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ShareProjectUseCase } from './ShareProjectUseCase'

export class ShareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const shareProjectBodySchema = z.object({
      user: z.object({
        email: z.string().email().max(100),
        permission: z.string().min(1).max(50),
      }),
      projectId: z.string().min(6).max(100),
    })

    const {
      user: { email, permission },
      projectId,
    } = shareProjectBodySchema.parse(req.body)

    const shareProjectUseCase = container.resolve(ShareProjectUseCase)
    const updatedProject = await shareProjectUseCase.execute(
      { email, permission },
      projectId,
      req.user.id,
    )

    return res.status(200).json(updatedProject)
  }
}
