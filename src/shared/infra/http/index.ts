import cors from 'cors'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import morgan from 'morgan'

// eslint-disable-next-line import-helpers/order-imports

import 'express-async-errors'
import 'reflect-metadata'

import '@shared/container'

import { MulterError } from 'multer'
import swaggerUi from 'swagger-ui-express'
import { ZodError } from 'zod'

import { env } from '@env/index'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { AppError } from '@shared/errors/AppError'
import { router } from '@shared/infra/http/routes'
import { getConnectionMongoDb } from '@shared/infra/mongoose/dataSource'

import docs from '../docs/swagger.json'
import { RateLimiter } from './middlewares/limiter'

const app = express()
const appName = env.APP_NAME
const appPort = env.APP_PORT

const rateLimit = new RateLimiter({ limit: 50, per: 'minutes' })

if (env.NODE_ENV !== 'dev') {
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

if (env.NODE_ENV !== 'dev') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

getConnectionMongoDb()
  .then(() => {
    if (env.NODE_ENV === 'dev') console.log('Database connected')
  })
  .catch((err) => {
    throw err
  })

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(docs, {
    customSiteTitle: 'Ognare API',
  }),
)

app.use('/api', router)

if (env.NODE_ENV !== 'dev') {
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
    if (env.NODE_ENV === 'dev') console.log(err)

    return res.status(400).json({
      errorTitle: 'Informações inválidas',
      errorMessage: 'Verifique as informações fornecidas e tente novamente',
    })
  }

  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      errorTitle: 'Imagem maior que 2 mb',
      errorMessage:
        'O limite de tamanho de imagens aceito é 2 mb nos planos free.',
    })
  }

  if (err instanceof Error) {
    if (env.NODE_ENV === 'dev') console.log(err)

    res.status(500).json({
      errorTitle: 'Internal error',
      errorMessage: 'Internal error',
    })
  }
})

app.listen(appPort, () => {
  if (env.NODE_ENV === 'dev')
    console.log(`${appName} running on port ${appPort}`)
})
