import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { RecoveryPasswordUseCase } from './RecoveryPasswordUseCase'

export class RecoveryPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { password, token } = req.body

    if (!password || !token) {
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a criação do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })
    }

    const recoveryPasswordUseCase = container.resolve(RecoveryPasswordUseCase)
    await recoveryPasswordUseCase.execute({ password, token })

    return res.status(200).json({
      successTitle: 'Senha alterada.',
      successMessage:
        'Você pode continuar sua jornada daqui, nobre viajante. Sempre que se perder pode contar com a gente.',
    })
  }
}
