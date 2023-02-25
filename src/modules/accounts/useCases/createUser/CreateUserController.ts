import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { CreateUserUseCase } from './CreateUserUseCase'

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
