import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { GetUserPerCodeUseCase } from './GetUserPerCodeUseCase'

export class GetUserPerCodeController {
  async handle(req: Request, res: Response): Promise<Response> {
    const code = req.body.code
    const infosUser = req.body.infosUser as ICreateUserDTO

    const getUserPerCodeUseCase = container.resolve(GetUserPerCodeUseCase)
    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const user = await getUserPerCodeUseCase.execute(code, infosUser)

    const newSession = await createSessionUseCase.execute({
      email: user.email,
      password: infosUser.password,
    })

    return res.status(200).json(newSession)
  }
}
