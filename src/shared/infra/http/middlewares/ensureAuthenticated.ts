import { type NextFunction, type Request, type Response } from 'express'
import { verify } from 'jsonwebtoken'
import { container } from 'tsyringe'

import session from '@config/session'
import { GetInfosUseCase } from '@modules/accounts/useCases/GetInfosUseCase'
import { AppError } from '@shared/errors/AppError'
import { makeErrorUserNotFound } from '@shared/errors/users/makeErrorUserNotFound'

interface IPayload {
  admin: boolean
  isInitialized: boolean
  sub: string
}

export class EnsureAuthenticatedMiddleware {
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies['@og-token']

    if (!token) {
      throw new AppError({
        title: 'Invalid token!',
        message: 'Invalid token',
        statusCode: 401,
      })
    }

    const getUserUseCase = container.resolve(GetInfosUseCase)

    try {
      const {
        admin,
        isInitialized,
        sub: userId,
      } = verify(token, session.secretToken) as IPayload

      const user = await getUserUseCase.execute({ userId })
      if (!user) throw makeErrorUserNotFound()

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
}
