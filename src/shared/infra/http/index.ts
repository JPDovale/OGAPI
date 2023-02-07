import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import { ZodError } from 'zod'

import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import 'express-async-errors'
import 'reflect-metadata'

import '@shared/container'

import { AppError } from '@shared/errors/AppError'
import { router } from '@shared/infra/http/routes'
import { getConnectionMongoDb } from '@shared/infra/mongoose/dataSource'

import { RateLimiter } from './middlewares/limiter'

dotenv.config()

const app = express()
const appName = process.env.APP_NAME
const appPort = process.env.APP_PORT

const rateLimit = new RateLimiter({ limit: 50, per: 'minutes' })
app.use(rateLimit.rete)

Sentry.init({
  dsn: process.env.DNS_SENTRY,
  // environment: params.INSTANCE_NAME,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(
  cors({
    allowedHeaders: '*',
    origin: '*',
  }),
)
app.use(express.json())
app.use(morgan('combined'))

getConnectionMongoDb()
  .then(() => console.log('Database connected'))
  .catch((err) => {
    throw err
  })

app.use(router)

app.use(Sentry.Handlers.errorHandler())

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorTitle: err.title,
      errorMessage: err.message,
    })
  }

  if (err instanceof ZodError) {
    console.log(err)

    return res.status(401).json({
      errorTitle: 'Informações inválidas',
      errorMessage:
        'As informações fornecidas não são aceitas pela aplicação. Rastreamos o erro no seu dispositivo e resolveremos em breve',
    })
  }

  if (err instanceof Error) {
    console.log(err)

    res.status(500).json({
      errorTitle: 'Internal error',
      errorMessage: 'Try again later.',
    })
  }
})

app.listen(appPort, () => {
  console.log(`${appName} running on port ${appPort}`)
})
