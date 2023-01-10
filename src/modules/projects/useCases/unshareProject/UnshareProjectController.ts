import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { UnshareProjectUseCase } from './UnshareProjectUseCase'

export class UnshareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userEmail, projectId } = req.body

    const unshareProjectUseCase = container.resolve(UnshareProjectUseCase)

    const response = await unshareProjectUseCase.execute(
      userEmail,
      projectId,
      req.user.id,
    )

    return res.status(200).json(response)
  }
}
