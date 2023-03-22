import cors from 'cors'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import morgan from 'morgan'
import { ZodError } from 'zod'

import { env } from '@env/index'
import * as Sentry from '@sentry/node'
// eslint-disable-next-line import-helpers/order-imports
import * as Tracing from '@sentry/tracing'

import 'express-async-errors'
import 'reflect-metadata'

import '@shared/container'

import { AppError } from '@shared/errors/AppError'
import { router } from '@shared/infra/http/routes'
import { getConnectionMongoDb } from '@shared/infra/mongoose/dataSource'

import { RateLimiter } from './middlewares/limiter'

const app = express()
const appName = env.APP_NAME
const appPort = env.APP_PORT

const rateLimit = new RateLimiter({ limit: 50, per: 'minutes' })
const isDev = env.IS_DEV

if (!isDev) {
  app.use(rateLimit.rete)

  Sentry.init({
    dsn: env.DNS_SENTRY,
    // environment: params.INSTANCE_NAME,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}
app.use(
  cors({
    allowedHeaders: '*',
    origin: '*',
  }),
)
app.use(express.json())

if (!isDev) {
  app.use(morgan('combined'))
}

getConnectionMongoDb()
  .then(() => {
    if (isDev) console.log('Database connected')
  })
  .catch((err) => {
    throw err
  })

app.use(router)

if (!isDev) {
  app.use(Sentry.Handlers.errorHandler())
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorTitle: err.title,
      errorMessage: err.message,
    })
  }

  if (err instanceof ZodError) {
    if (isDev) console.log(err)

    return res.status(400).json({
      errorTitle: 'Informações inválidas',
      errorMessage: 'Verifique as informações fornecidas e tente novamente',
    })
  }

  if (err instanceof Error) {
    if (isDev) console.log(err)

    res.status(500).json({
      errorTitle: 'Internal error',
      errorMessage: 'Internal error',
    })
  }
})

app.listen(appPort, () => {
  if (isDev) console.log(`${appName} running on port ${appPort}`)
})
