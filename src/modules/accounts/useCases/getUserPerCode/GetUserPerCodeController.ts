import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSessionUseCase } from '../createSession/CreateSessionUseCase'
import { GetUserPerCodeUseCase } from './GetUserPerCodeUseCase'

export class GetUserPerCodeController {
  async handle(req: Request, res: Response): Promise<Response> {
    const getUserBodySchema = z.object({
      code: z.string().min(1).max(30),
      infosUser: z.object({
        name: z.string().min(1).max(200),
        email: z.string().min(1).max(100).email(),
        password: z.string().min(6).max(200),
        age: z.string().max(4).optional(),
        sex: z.string().max(30).optional(),
        username: z.string().max(200).optional(),
      }),
    })

    const {
      code,
      infosUser: { age, email, name, password, sex, username },
    } = getUserBodySchema.parse(req.body)

    const getUserPerCodeUseCase = container.resolve(GetUserPerCodeUseCase)
    const createSessionUseCase = container.resolve(CreateSessionUseCase)

    const user = await getUserPerCodeUseCase.execute({
      code,
      infosUser: {
        age,
        email,
        name,
        password,
        sex,
        username,
      },
    })

    const newSession = await createSessionUseCase.execute({
      email: user.email,
      password,
    })

    return res.status(200).json(newSession)
  }
}
