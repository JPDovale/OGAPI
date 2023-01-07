import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { CreateSessionUseCase } from './CreateSessionUseCase'

export class CreateSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    if (!email || !password)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para o login do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const session = await createSessionUseCase.execute({ email, password })

    return res.status(200).json(session)
  }
}
