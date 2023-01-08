import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@shared/errors/AppError'

import { UserUpdateUseCase } from './UserUpdateUseCase'

export class UserUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user
    const { username, name, email, age, sex } = req.body

    if (!username && !name && !email && !age && !sex)
      throw new AppError({
        title: 'Ausência de informações',
        message: 'Nenhuma informação recebida para efetuar a alteração',
        statusCode: 409,
      })

    const userUpdateUseCase = container.resolve(UserUpdateUseCase)

    const updatedUser = await userUpdateUseCase.execute(
      username,
      name,
      email,
      age,
      sex,
      id,
    )

    return res.status(200).json(updatedUser)
  }
}
