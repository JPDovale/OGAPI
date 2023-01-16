import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { LoginWithGoogleUseCase } from './LoginWithGoogleUseCase'

export class LoginWithGoogleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, image } = req.body

    if (!email || !name)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para o login do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const loginWithGoogleUseCase = container.resolve(LoginWithGoogleUseCase)
    const session = await loginWithGoogleUseCase.execute(email, image, name)

    return res.status(201).json(session)
  }
}
