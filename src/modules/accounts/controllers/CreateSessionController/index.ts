import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { CreateSessionUseCase } from '@modules/accounts/useCases/CreateSessionUseCase'

export class CreateSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createSessionBodySchema = z.object({
      email: z.string().email().max(100),
      password: z.string().max(100),
    })

    const { email, password } = createSessionBodySchema.parse(req.body)

    const createSessionUseCase = container.resolve(CreateSessionUseCase)
    const response = await createSessionUseCase.execute({
      email,
      password,
      onApplication: '@og-Web',
    })

    const responsePartied = parserUserResponse(response)
    const responseStatusCode = response.error ? response.error.statusCode : 201

    res.cookie('@og-refresh-token', response.data?.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      path: '/',
      sameSite: false,
      secure: true,
    })

    res.cookie('@og-token', response.data?.token, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      sameSite: false,
      secure: true,
    })

    return res.status(responseStatusCode).json(responsePartied)
  }
}
