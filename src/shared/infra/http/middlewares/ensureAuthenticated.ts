import { type NextFunction, type Request, type Response } from 'express'
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
  const token = req.cookies['@og-token']

  if (!token) {
    throw new AppError({
      title: 'Invalid token!',
      message: 'Invalid token',
      statusCode: 401,
    })
  }

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
