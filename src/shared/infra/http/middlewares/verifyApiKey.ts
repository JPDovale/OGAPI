import bodyParser from 'body-parser'
import { type NextFunction, type Request, type Response } from 'express'

import { env } from '@env/index'

export class VerifyApiKey {
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.originalUrl === '/api/products/stripe/webhooks') {
      next()
      return
    }

    const apiKey = req.headers['ms-api-key']
    const privateApiKey = req.headers['ms-private-api-key']

    if (privateApiKey && privateApiKey === env.KEY_TO_PRIVATE_REQUEST) {
      next()
      return
    }

    if (!apiKey || apiKey !== env.KEY_TO_REQUEST) {
      res.status(401).send('Unauthorized :(')
      return
    }

    bodyParser.json()(req, res, next)
  }

  async verifyPrivate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const apiKey = req.headers['ms-private-api-key']

    if (!apiKey || apiKey !== env.KEY_TO_PRIVATE_REQUEST) {
      res.status(401).send('Unauthorized :(')
      return
    }

    bodyParser.json()(req, res, next)
  }
}
