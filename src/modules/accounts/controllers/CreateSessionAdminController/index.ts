import { type Request, type Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateSessionUseCase } from '@modules/accounts/useCases/CreateSessionUseCase'

export class CreateSessionAdminController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createSessionAdminBodySchema = z.object({
      email: z.string().email().max(100),
      password: z.string().max(100),
    })

    const { email, password } = createSessionAdminBodySchema.parse(req.body)

    const createSessionUseCase = container.resolve(CreateSessionUseCase)
    const { refreshToken, token, user, infos } =
      await createSessionUseCase.execute({
        email,
        password,
        verifyIsAdmin: true,
      })

    if (!infos.isAdmin) {
      return res.status(401).json({
        errorMessage: 'Unauthorized',
        errorTitle: 'Unauthorized',
      })
    }

    res.cookie('@og-refresh-token', refreshToken, {
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    res.cookie('@og-token', token, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    return res.status(201).json({ user })
  }
}
