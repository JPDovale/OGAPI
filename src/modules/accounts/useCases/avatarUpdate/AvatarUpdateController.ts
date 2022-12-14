import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AvatarUpdateUseCase } from './AvatarUpdateUseCase'

export class AvatarUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const avatarUpdateUseCase = container.resolve(AvatarUpdateUseCase)

    await avatarUpdateUseCase.execute(req.file, id)

    return res.status(200).json({ message: 'Imagem alterada com sucesso' })
  }
}
