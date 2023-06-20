import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
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

    const responseUserCreated = await createUserUseCase.execute({
      name,
      age,
      email,
      password,
      sex,
      username,
    })

    const responseUserCreatedPartied = parserUserResponse(responseUserCreated)

    if (responseUserCreated.error) {
      return res
        .status(responseUserCreated.error.statusCode)
        .json(responseUserCreatedPartied)
    }

    const responseUserCreatedSession = await createSessionUseCase.execute({
      email: responseUserCreated.data!.user.email,
      onApplication: '@og-Web',
      password,
    })

    const responseUserCreatedSessionPartied = parserUserResponse(
      responseUserCreatedSession,
    )

    if (responseUserCreatedSession.error) {
      return res
        .status(responseUserCreatedSession.error.statusCode)
        .json(responseUserCreatedSessionPartied)
    }

    res.cookie(
      '@og-refresh-token',
      responseUserCreatedSession.data?.refreshToken,
      {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      },
    )

    res.cookie('@og-token', responseUserCreatedSession.data?.token, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    return res.status(200).json(responseUserCreatedSessionPartied)
  }
}
