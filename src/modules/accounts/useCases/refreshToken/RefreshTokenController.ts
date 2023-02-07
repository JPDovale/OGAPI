import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { RefreshTokenUseCase } from './RefreshTokenUseCase'

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const refreshTokenValidation = z.string().min(15).max(500)

    const tokenRecovered =
      req.body.token || req.query.token || req.headers['x-access-token']

    const token = refreshTokenValidation.parse(tokenRecovered)

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)
    const tokens = await refreshTokenUseCase.execute(token)

    return res.json(tokens)
  }
}
