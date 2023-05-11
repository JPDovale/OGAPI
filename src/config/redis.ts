import { Redis } from 'ioredis'

import { env } from '@env/index'
import { AppError } from '@shared/errors/AppError'

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
})

redisClient
  .ping((err, result) => {
    if (err) {
      console.error(err)

      throw new AppError({
        title: 'Redis not up',
        message: 'Redis not up',
        statusCode: 500,
      })
    } else {
      console.log('Redis up', result)
    }
  })
  .catch((err) => {
    throw err
  })

export { redisClient }
