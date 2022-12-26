import mongoose from 'mongoose'

const RefreshToken = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expiresDate: { type: String, required: true },
  application: { type: String, required: true, default: 'OG-web' },
  createAt: { type: String, required: true, default: new Date() },
})

export interface IRefreshTokenMongo {
  id?: string
  refreshToken: string
  userId: string
  expiresDate: string
  application?: 'OG-web' | 'OG-mobile' | string
  createAt?: string
}

export const RefreshTokenMongo = mongoose.model('UserToken', RefreshToken)
