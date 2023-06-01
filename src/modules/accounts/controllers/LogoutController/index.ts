import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { LogoutUseCase } from '@modules/accounts/useCases/LogoutUseCase'

export class LogoutController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const logoutUseCase = container.resolve(LogoutUseCase)
    const response = await logoutUseCase.execute({ userId: id })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    res.cookie('@og-refresh-token', '')
    res.cookie('@og-token', '')

    return res.status(responseStatusCode).json(response)
  }
}
