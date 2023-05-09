import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSessionUseCase } from '@modules/accounts/useCases/CreateSessionUseCase'

export class CreateSessionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createSessionBodySchema = z.object({
      email: z.string().email().max(100),
      password: z.string().max(100),
    })

    const { email, password } = createSessionBodySchema.parse(req.body)

    const createSessionUseCase = container.resolve(CreateSessionUseCase)
    const { refreshToken, token, user } = await createSessionUseCase.execute({
      email,
      password,
    })

    res.cookie('@og-refresh-token', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      path: '/',
      secure: false,
      sameSite: true,
    })

    res.cookie('@og-token', token, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      secure: false,
      sameSite: true,
    })

    return res.status(200).json({ user })
  }
}
