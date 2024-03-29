import { type NextFunction, type Request, type Response } from 'express'
import { verify } from 'jsonwebtoken'
import { container } from 'tsyringe'

import session from '@config/session'
import { parserUserResponse } from '@modules/accounts/responses/parsers/parseUserResponse'
import { GetInfosUseCase } from '@modules/accounts/useCases/GetInfosUseCase'

import { type IResolve } from '../parsers/responses/types/IResponse'

interface IPayload {
  admin: boolean
  isInitialized: boolean
  sub: string
}

export class EnsureAuthenticatedMiddleware {
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies['@og-token']
      ? req.cookies['@og-token']
      : req.headers?.cookies
      ? JSON.parse(String(req.headers?.cookies)).token
      : undefined

    if (!token || token === 'undefined') {
      res.status(401).json({
        ok: false,
        error: {
          title: 'Login failed',
          message: 'Login failed',
          statusCode: 401,
        },
      })
      return
    }

    const getUserUseCase = container.resolve(GetInfosUseCase)

    try {
      const { admin, sub: userId } = verify(
        token,
        session.secretToken,
      ) as IPayload

      const response = await getUserUseCase.execute({ userId })
      const responsePartied = parserUserResponse(response)

      if (response.error) {
        res.status(response.error.statusCode).json(responsePartied)
        return
      }

      req.user = {
        id: userId,
        admin,
        onApplication: req.headers['on-application'] ?? '@og-Web',
      }

      next()
      return
    } catch {
      const response: IResolve = {
        ok: false,
        error: {
          title: 'Login failed',
          message: 'Login failed',
          statusCode: 401,
        },
      }

      res.status(response.error!.statusCode).json(response)
    }
  }
}
