import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  sex: { type: String, required: true },
  age: { type: String, required: true },
  admin: { type: Boolean, default: false, required: false },
  payed: { type: Boolean, default: false, required: false },
  isInitialized: { type: Boolean, default: false, required: false },
  code: { type: String, required: false },
  createAt: { type: String, required: true, default: new Date() },
  updateAt: { type: String, required: true, default: new Date() },
})

export interface IUserMongo {
  id?: string
  name: string
  username: string
  email: string
  password: string
  avatar?: string
  sex: string
  age: string
  admin?: boolean
  payed?: boolean
  isInitialized?: boolean
  code?: string
  createAt?: string
  updateAt?: string
}

export const UserMongo = mongoose.model('User', UserSchema)
