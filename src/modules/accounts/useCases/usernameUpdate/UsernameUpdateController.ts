import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { UsernameUpdateUseCase } from './UsernameUpdateUseCase'

export class UsernameUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { newUsername } = req.body

    const usernameUpdateUseCase = container.resolve(UsernameUpdateUseCase)

    await usernameUpdateUseCase.execute(newUsername, id)

    return res.status(200).json({ success: 'Nome de usuário alterado' })
  }
}
