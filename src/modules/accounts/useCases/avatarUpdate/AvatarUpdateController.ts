import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { AvatarUpdateUseCase } from './AvatarUpdateUseCase'

export class AvatarUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const file = req.file

    if (!file) {
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })
    }

    const avatarUpdateUseCase = container.resolve(AvatarUpdateUseCase)
    const updatedUser = await avatarUpdateUseCase.execute(file, id)

    return res.status(200).json(updatedUser)
  }
}
