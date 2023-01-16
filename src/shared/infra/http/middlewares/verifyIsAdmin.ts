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
    throw new AppError({
      title: 'Token missing!',
      message: 'Token missing!',
      statusCode: 401,
    })
  }

  const [, token] = authHeader.split(' ')

  try {
    const { admin } = verify(token, session.secretRefreshToken) as IPayload

    if (!admin) {
      throw new AppError({
        title: 'Acesso negado!',
        message: 'Acesso negado!',
        statusCode: 409,
      })
    }

    next()
  } catch {
    throw new AppError({
      title: 'Acesso negado!',
      message: 'Token invalido!',
      statusCode: 409,
    })
  }
}
