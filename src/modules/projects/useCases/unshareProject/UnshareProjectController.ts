import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UnshareProjectUseCase } from './UnshareProjectUseCase'

export class UnshareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const unshareProjectBodySchema = z.object({
      userEmail: z.string().email().max(100),
      projectId: z.string().min(6).max(100),
    })

    const { userEmail, projectId } = unshareProjectBodySchema.parse(req.body)

    const unshareProjectUseCase = container.resolve(UnshareProjectUseCase)
    const response = await unshareProjectUseCase.execute(
      userEmail,
      projectId,
      req.user.id,
    )

    return res.status(200).json(response)
  }
}
