import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSessionUseCase } from '@modules/accounts/useCases/CreateSessionUseCase'
import { CreateUserUseCase } from '@modules/accounts/useCases/CreateUserUseCase'

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createUserBodySchema = z.object({
      name: z.string().min(1).max(200),
      email: z.string().min(1).max(100).email(),
      password: z.string().min(6).max(200),
      age: z.string().max(4).optional(),
      sex: z.string().max(30).optional(),
      username: z.string().max(200).optional(),
    })

    const { name, email, password, age, sex, username } =
      createUserBodySchema.parse(req.body)

    const createUserUseCase = container.resolve(CreateUserUseCase)
    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const { user } = await createUserUseCase.execute({
      name,
      age,
      email,
      password,
      sex,
      username,
    })

    const {
      refreshToken,
      token,
      user: userInfos,
    } = await createSessionUseCase.execute({
      email: user.email,
      password,
    })

    return res.status(201).json({ refreshToken, token, user: userInfos })
  }
}
