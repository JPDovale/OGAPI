import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { RefreshTokenUseCase } from '@modules/accounts/useCases/RefreshTokenUseCase'

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const token = req.cookies['@og-refresh-token']

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)
    const { refreshToken, token: accessToken } =
      await refreshTokenUseCase.execute({ token })

    res.cookie('@og-refresh-token', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    res.cookie('@og-token', accessToken, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    return res.status(204).end()
  }
}
