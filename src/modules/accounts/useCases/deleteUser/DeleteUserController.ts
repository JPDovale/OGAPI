import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteUserUseCase } from './DeleteUserUseCase'

export class DeleteUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { user } = req

    const deleteUserUseCase = container.resolve(DeleteUserUseCase)

    await deleteUserUseCase.execute(id || user.id)

    return res.status(202).json({ success: 'User deleted' })
  }
}
