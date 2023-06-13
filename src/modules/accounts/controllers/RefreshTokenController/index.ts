import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import { RefreshTokenUseCase } from '@modules/accounts/useCases/RefreshTokenUseCase'

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const token = req.cookies['@og-refresh-token']
      ? req.cookies['@og-refresh-token']
      : req.headers?.cookies
      ? JSON.parse(String(req.headers?.cookies)).refreshToken
      : undefined

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)
    const response = await refreshTokenUseCase.execute({
      token,
      onApplication: String(req.headers['on-application'] ?? '@og-Web'),
    })
    const responseStatusCode = response.error ? response.error.statusCode : 200

    res.cookie('@og-refresh-token', response.data?.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    res.cookie('@og-token', response.data?.token, {
      maxAge: 1000 * 60 * 10, // 10 min
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    return res.status(responseStatusCode).json({
      ok: response.ok,
    })
  }
}
