import dotenv from 'dotenv'
dotenv.config()

export default {
  databaseUrl: `${process.env.DATABASE_MONGO_URL}`,
}
