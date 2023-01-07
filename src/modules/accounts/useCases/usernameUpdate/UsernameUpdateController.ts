import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { UsernameUpdateUseCase } from './UsernameUpdateUseCase'

export class UsernameUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { newUsername } = req.body

    if (!newUsername)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a alteração do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const usernameUpdateUseCase = container.resolve(UsernameUpdateUseCase)

    const updatedUser = await usernameUpdateUseCase.execute(newUsername, id)

    return res.status(200).json(updatedUser)
  }
}
