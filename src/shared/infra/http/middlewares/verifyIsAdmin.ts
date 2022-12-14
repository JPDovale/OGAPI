import session from 'config/session'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { AppError } from '@shared/errors/AppError'

interface IPayload {
  admin: boolean
}

export async function verifyIsAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing!', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { admin } = verify(token, session.secretRefreshToken) as IPayload

    if (!admin) {
      throw new AppError('Acesses denied!', 401)
    }

    next()
  } catch {
    throw new AppError('Invalid token!', 401)
  }
}
