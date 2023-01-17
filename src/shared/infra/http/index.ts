import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import 'reflect-metadata'

import '@shared/container'

import { AppError } from '@shared/errors/AppError'
import { router } from '@shared/infra/http/routes'
import { getConnectionMongoDb } from '@shared/infra/mongoose/dataSource'

const app = express()

getConnectionMongoDb()
  .then(() => console.log('Database connected'))
  .catch((err) => {
    throw err
  })

app.use(
  cors({
    allowedHeaders: ['Access-Control-Allow-Origin', 'Access-Control'],
    origin: '*',
  }),
)
app.use(express.json())

app.use(router)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorTitle: err.title,
      errorMessage: err.message,
    })
  }

  return res.status(500).json(err)
})

app.listen('3030', () => {
  console.log('Server running on port 3030')
})
