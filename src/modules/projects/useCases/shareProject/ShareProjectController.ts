import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ShareProjectUseCase } from './ShareProjectUseCase'

export class ShareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { users, projectId } = req.body

    const shareProjectUseCase = container.resolve(ShareProjectUseCase)

    const response = await shareProjectUseCase.execute(
      users,
      projectId,
      req.user.id,
    )

    return res.status(200).json({
      message:
        response.length === users.length
          ? undefined
          : 'Usuários adicionados com sucesso',
      errors: response,
    })
  }
}
