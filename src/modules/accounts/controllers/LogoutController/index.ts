import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { LogoutUseCase } from '@modules/accounts/useCases/LogoutUseCase'

export class LogoutController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user

    const logoutUseCase = container.resolve(LogoutUseCase)
    await logoutUseCase.execute({ userId: id })

    res.clearCookie('@og-refresh-token')
    res.clearCookie('@og-token')

    return res.status(200).end()
  }
}
