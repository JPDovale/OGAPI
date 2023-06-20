import cookieParser from 'cookie-parser'
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

import docs from '../docs/swagger.json'
import { RateLimiter } from './middlewares/limiter'

const app = express()
const appName = env.APP_NAME
const appPort = env.APP_PORT

const rateLimit = new RateLimiter({ limit: 50, per: 'minutes' })

app.use(
  cors({
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Accept-Language',
      'Accept-Encoding',
      'Origin',
      'Referer',
      'Cookie',
      'Sec-Fetch-Dest',
      'Sec-Fetch-Mode',
      'Sec-Fetch-Site',
      'Pragma',
      'Cache-Control',
      'Access-Control-Allow-Origin',
      'On-Application',
      'Ms-Api-Key',
      'Ms-Private-Api-Key',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: [
      'https://magiscrita.com',
      'https://magiscrita.com',
      'magiscrita.com',
      'www.magiscrita.com',
      'https://localhost:3000',
      'https://localhost',
    ],
    preflightContinue: false,
    credentials: true,
  }),
)

// app.use((req, res, next) => {
//   if (req.originalUrl === '/api/products/stripe/webhooks') {
//     next()
//   } else {
//     bodyParser.json()(req, res, next)
//   }
// })

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

if (env.NODE_ENV !== 'dev') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(docs, {
    customSiteTitle: 'Ognare API',
  }),
)

app.use(cookieParser())
app.use('/api', router)

if (env.NODE_ENV !== 'dev') {
  app.use(Sentry.Handlers.errorHandler())
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      error: err,
    })
  }

  if (err instanceof ZodError) {
    if (env.NODE_ENV === 'dev') console.log(err)

    return res.status(400).json({
      ok: false,
      error: {
        title: 'Informações inválidas',
        message: 'Verifique as informações fornecidas e tente novamente',
        statusCode: 400,
      },
    })
  }

  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      ok: false,
      error: {
        title: 'Imagem maior que 2 mb',
        message:
          'O limite de tamanho de imagens aceito é 2 mb nos planos free.',
        statusCode: 400,
      },
    })
  }

  if (err instanceof Error) {
    if (env.NODE_ENV === 'dev') console.log(err)

    res.status(500).json({
      ok: false,
      error: {
        title: 'Internal error',
        message: 'Internal error',
        statusCode: 500,
      },
    })
  }
})

app.listen(appPort, () => {
  if (env.NODE_ENV === 'dev')
    console.log(`${appName} running on port ${appPort}`)
})
