import session from 'config/session'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { RefreshTokenRepository } from '@modules/accounts/infra/mongoose/repositories/RefreshTokenRepository'
import { AppError } from '@shared/errors/AppError'

interface IPayload {
  admin: boolean
  isInitialized: boolean
  sub: string
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization

  const refreshTokenRepository = new RefreshTokenRepository()

  if (!authHeader) {
    throw new AppError('Token missing!', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const {
      admin,
      isInitialized,
      sub: userId,
    } = verify(token, session.secretRefreshToken) as IPayload

    const user = await refreshTokenRepository.findByUserIdAndRefreshToken(
      userId,
      token,
    )

    if (!user) {
      throw new AppError('User does not exists!', 401)
    }

    req.user = {
      id: userId,
      isInitialized,
      admin,
    }

    next()
  } catch {
    throw new AppError('Invalid token!', 401)
  }
}
