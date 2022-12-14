import mongoose from 'mongoose'

const RefreshToken = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expiresDate: { type: String, required: true },
  createAt: { type: String, required: true, default: new Date() },
})

export interface IRefreshTokenMongo {
  id?: string
  refreshToken: string
  userId: string
  expiresDate: string
  createAt?: string
}

export const RefreshTokenMongo = mongoose.model('UserToken', RefreshToken)
