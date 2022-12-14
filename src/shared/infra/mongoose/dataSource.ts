import database from 'config/database'
import mongoose from 'mongoose'

export async function getConnectionMongoDb(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', false)
  return await mongoose.connect(database.databaseUrl)
}
