import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { UnshareProjectUseCase } from './UnshareProjectUseCase'

export class UnshareProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { users, projectId } = req.body

    const unshareProjectUseCase = container.resolve(UnshareProjectUseCase)

    const response = await unshareProjectUseCase.execute(
      users,
      projectId,
      req.user.id,
    )

    return res.status(200).json({
      message:
        response.length === users.length
          ? undefined
          : 'Usuários removidos com sucesso',
      erros: response,
    })
  }
}
