import mongoose from 'mongoose'

import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

import { IAvatar } from './Avatar'
import { INotification } from './Notification'

const dateProvider = new DayJsDateProvider()

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: Object, default: {} },
  sex: { type: String, required: true },
  age: { type: String, required: true },
  admin: { type: Boolean, default: false, required: false },
  payed: { type: Boolean, default: false, required: false },
  isInitialized: { type: Boolean, default: false, required: false },
  code: { type: String, required: false },
  createAt: {
    type: String,
    required: true,
    default: dateProvider.getDate(new Date()),
  },
  updateAt: {
    type: String,
    required: true,
    default: dateProvider.getDate(new Date()),
  },
  notifications: { type: Array<INotification>, default: [] },
})

export interface IUserMongo {
  id?: string
  name: string
  username: string
  email: string
  password: string
  avatar?: IAvatar
  sex: string
  age: string
  admin?: boolean
  payed?: boolean
  isInitialized?: boolean
  code?: string
  createAt?: string
  updateAt?: string
  notifications?: INotification[]
}

export const UserMongo = mongoose.model('User', UserSchema)
