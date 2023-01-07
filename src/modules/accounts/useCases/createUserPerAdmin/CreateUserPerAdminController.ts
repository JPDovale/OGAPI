import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { CreateUserPerAdminUseCase } from './CreateUserPerAdminUseCase'

export class CreateUserPerAdminController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, username, age, sex } = req.body

    if (!name)
      throw new AppError({
        title: 'Ausência de informações',
        message:
          'Algumas informações necessárias para a criação do usuário estão faltando. Verifique as informações enviadas e tente novamente.',
        statusCode: 409,
      })

    const createUserPerAdminUseCase = container.resolve(
      CreateUserPerAdminUseCase,
    )

    const newUser = await createUserPerAdminUseCase.execute({
      name,
      username,
      age,
      sex,
    })

    return res.status(201).json(newUser)
  }
}
