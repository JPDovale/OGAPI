import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { AvatarUpdateUseCase } from './AvatarUpdateUseCase'

export class AvatarUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const file = req.file

    const avatarUpdateUseCase = container.resolve(AvatarUpdateUseCase)
    const updatedUser = await avatarUpdateUseCase.execute(file, id)

    return res.status(200).json(updatedUser)
  }
}
