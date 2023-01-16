import mongoose from 'mongoose'

import database from '@config/database'

export async function getConnectionMongoDb(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', false)
  return await mongoose.connect(database.databaseUrl)
}
