import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { LogoutUseCase } from '@modules/accounts/useCases/LogoutUseCase'

export class LogoutController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const logoutUseCase = container.resolve(LogoutUseCase)
    const response = await logoutUseCase.execute({ userId: id })

    if (response.error) {
      res.status(response.error.statusCode).json(response)
    }

    res.cookie('@og-refresh-token', '')
    res.cookie('@og-token', '')

    return res.status(200).json(response)
  }
}
