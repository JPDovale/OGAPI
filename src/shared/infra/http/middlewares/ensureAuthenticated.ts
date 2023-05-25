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

    if (!token) {
      const response: IResolve = {
        ok: false,
        error: {
          title: 'Login failed',
          message: 'Login failed',
          statusCode: 401,
        },
      }

      res.status(response.error!.statusCode).json(response)
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
