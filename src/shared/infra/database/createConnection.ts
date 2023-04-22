import { env } from '@env/index'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

prisma
  .$connect()
  .then(() => {
    console.log('Database mysql connect')
  })
  .catch((err) => {
    console.error(err)
    throw err
  })
