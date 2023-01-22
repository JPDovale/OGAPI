import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { SendForgotPasswordMailUseCase } from './sendForgotPasswordMailController'

export class SendForgotPasswordMailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const email = req.body.email

    if (!email)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a criação do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase,
    )
    await sendForgotPasswordMailUseCase.execute(email)

    return res.status(200).json({
      successTitle: 'Email enviado.',
      successMessage: 'Um email de recuperação de senha foi enviado para você.',
    })
  }
}
