import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { AvatarUpdateUseCase } from '@modules/accounts/useCases/AvatarUpdateUseCase'

export class AvatarUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const file = req.file

    const avatarUpdateUseCase = container.resolve(AvatarUpdateUseCase)
    const { user } = await avatarUpdateUseCase.execute({ file, userId: id })

    return res.status(200).json({ user })
  }
}
