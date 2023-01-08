import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { PasswordUpdateUseCase } from './PasswordUpdateUseCase'

export class PasswordUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { oldPassword, password } = req.body

    if (!oldPassword || !password)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a criação do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const updatePasswordUseCase = container.resolve(PasswordUpdateUseCase)
    await updatePasswordUseCase.execute(id, oldPassword, password)

    return res.status(200).json({ errorTitle: 'Senha alterada com sucesso' })
  }
}
