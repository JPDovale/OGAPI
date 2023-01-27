import mongoose from 'mongoose'
import { container } from 'tsyringe'

import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

const dateProvider = container.resolve(DayJsDateProvider)

const RefreshToken = new mongoose.Schema({
  id: { type: String, required: true },
  refreshToken: { type: String, required: true },
  userId: { type: String, required: true },
  accessCode: { type: String, required: false },
  expiresDate: { type: String, required: true },
  application: { type: String, required: true, default: 'OG-web' },
  createAt: {
    type: String,
    required: true,
    default: dateProvider.getDate(new Date()),
  },
})

export interface IRefreshTokenMongo {
  id?: string
  refreshToken: string
  userId: string
  accessCode?: string
  expiresDate: string
  application?: 'OG-web' | 'OG-mobile' | string
  createAt?: string
}

export const RefreshTokenMongo = mongoose.model('UserToken', RefreshToken)
