import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UnshareProjectUseCase } from '@modules/projects/useCases/UnshareProjectUseCase'

export class UnshareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const unshareProjectParamsSchema = z.object({
      projectId: z.string().uuid(),
    })

    const unshareProjectBodySchema = z.object({
      userEmail: z.string().email().max(100),
    })

    const { id } = req.user
    const { projectId } = unshareProjectParamsSchema.parse(req.params)
    const { userEmail } = unshareProjectBodySchema.parse(req.body)

    const unshareProjectUseCase = container.resolve(UnshareProjectUseCase)
    const { project } = await unshareProjectUseCase.execute({
      userToUnshareEmail: userEmail,
      projectId,
      userId: id,
    })

    return res.status(200).json({ project })
  }
}
