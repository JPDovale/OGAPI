import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { CreateUserUseCase } from './CreateUserUseCase'

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password, age, sex, username } = req.body

    if (!name || !email || !password)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a criação do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const createUserUseCase = container.resolve(CreateUserUseCase)
    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const newUser = await createUserUseCase.execute({
      name,
      age,
      email,
      password,
      sex,
      username,
    })

    const newSession = await createSessionUseCase.execute({
      email: newUser.email,
      password,
    })

    return res.status(201).json(newSession)
  }
}
