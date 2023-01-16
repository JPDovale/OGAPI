import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import session from '@config/session'
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

  if (!authHeader) {
    throw new AppError({
      title: 'Invalid token!',
      message: 'Invalid token',
      statusCode: 401,
    })
  }

  const [, token] = authHeader.split(' ')

  try {
    const {
      admin,
      isInitialized,
      sub: userId,
    } = verify(token, session.secretToken) as IPayload

    req.user = {
      id: userId,
      isInitialized,
      admin,
    }

    next()
  } catch {
    throw new AppError({
      title: 'Invalid token!',
      message: 'Invalid token',
      statusCode: 401,
    })
  }
}
