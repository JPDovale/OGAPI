import { Request, Response } from 'express'
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit'

import { AppError } from '@shared/errors/AppError'

export interface IRateLimiter {
  limit: number
  per: 'minutes' | 'hours'
}
export class RateLimiter {
  rete: RateLimitRequestHandler

  constructor({ limit, per }: IRateLimiter) {
    this.rete = rateLimit({
      windowMs: per === 'minutes' ? 1 * 60 * 1000 : 1 * 60 * 1000 * 60,
      max: limit,
      keyGenerator(req: Request): string {
        return req.ip
      },
      handler(_, res: Response): void {
        throw new AppError({
          title: 'Limite de requisições ultrapassado',
          message:
            'Você fez muitas alterações em um período muito curto de tempo. Aguarde e tente novamente mais tarde.',
          statusCode: 429,
        })
      },
    })
  }
}
