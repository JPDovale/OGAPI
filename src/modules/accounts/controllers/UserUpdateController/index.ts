import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UserUpdateUseCase } from '@modules/accounts/useCases/UserUpdateUseCase'
import { AppError } from '@shared/errors/AppError'

export class UserUpdateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userUpdateBodySchema = z.object({
      name: z.string().max(200).optional(),
      email: z.string().max(100).optional(),
      age: z.string().max(4).optional(),
      sex: z.string().max(30).optional(),
      username: z.string().max(200).optional(),
    })

    const { id } = req.user
    const { username, name, email, age, sex } = userUpdateBodySchema.parse(
      req.body,
    )

    if (!username && !name && !email && !age && !sex)
      throw new AppError({
        title: 'Ausência de informações',
        message: 'Nenhuma informação recebida para efetuar a alteração',
        statusCode: 409,
      })

    const userUpdateUseCase = container.resolve(UserUpdateUseCase)
    const { user } = await userUpdateUseCase.execute({
      username,
      name,
      email,
      age,
      sex,
      userId: id,
    })

    return res.status(200).json({ user })
  }
}
