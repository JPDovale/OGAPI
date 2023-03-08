import { Redis } from 'ioredis'

import { env } from '@env/index'

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASS,
})

export { redisClient }
