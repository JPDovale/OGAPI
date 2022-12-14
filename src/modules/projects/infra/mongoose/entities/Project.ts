import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdPerUser: { type: String, required: true, unique: false },
  users: { type: Array, default: [] },
  private: { type: Boolean, required: true },
  password: { type: String, default: '' },
  type: { type: String, required: true },
  createAt: { type: String, required: true, default: new Date() },
  updateAt: { type: String, required: true, default: new Date() },
})

export interface IProjectMongo {
  id?: string
  name: string
  createdPerUser: string
  users: string[]
  private: boolean
  password?: string
  type: string
  createAt?: string
  updateAt?: string
}

export const ProjectMongo = mongoose.model('Project', ProjectSchema)
