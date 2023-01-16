import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { LogoutUseCase } from './LogoutUseCase'

export class LogoutController {
  async handle(req: Request, res: Response): Promise<any> {
    const { id } = req.user

    const logoutUseCase = container.resolve(LogoutUseCase)
    await logoutUseCase.execute(id)

    return res.status(200)
  }
}
