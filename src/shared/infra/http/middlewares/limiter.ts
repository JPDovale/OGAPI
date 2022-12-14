import { Request, Response } from 'express'
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit'

import { AppError } from '@shared/errors/AppError'

export class RateLimiter {
  rete: RateLimitRequestHandler

  constructor(limiter: number, per: 'minutes' | 'hours') {
    this.rete = rateLimit({
      windowMs: per === 'minutes' ? 1 * 60 * 1000 : 1 * 60 * 1000 * 60,
      max: limiter,
      keyGenerator(req: Request): string {
        return req.ip
      },
      handler(_, res: Response): void {
        throw new AppError(
          'Você fez muitas alterações em um período muito curto de tempo. Aguarde e tente novamente mais tarde.',
          429,
        )
      },
    })
  }
}
