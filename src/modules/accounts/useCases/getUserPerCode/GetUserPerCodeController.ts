import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { AppError } from '@shared/errors/AppError'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { GetUserPerCodeUseCase } from './GetUserPerCodeUseCase'

export class GetUserPerCodeController {
  async handle(req: Request, res: Response): Promise<Response> {
    const code = req.body.code
    const { age, email, name, password, sex, username } = req.body
      .infosUser as ICreateUserDTO

    if (!name || !email || !password)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a criação do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const getUserPerCodeUseCase = container.resolve(GetUserPerCodeUseCase)
    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const user = await getUserPerCodeUseCase.execute(code, {
      age,
      email,
      name,
      password,
      sex,
      username,
    })

    const newSession = await createSessionUseCase.execute({
      email: user.email,
      password,
    })

    return res.status(200).json(newSession)
  }
}
