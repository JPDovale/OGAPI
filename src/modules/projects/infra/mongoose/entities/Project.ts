import mongoose from 'mongoose'

import { IPlotProjectMongo, PlotProjectMongo } from './Plot'
import { ITagMongo } from './Tag'

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdPerUser: { type: String, required: true, unique: false },
  tags: { type: Array<ITagMongo>, default: [] },
  users: { type: Array<ISharedWhitUsers>, default: [] },
  private: { type: Boolean, required: true },
  password: { type: String, default: '' },
  type: { type: String, required: true },
  plot: { type: Object, default: {} },
  createAt: { type: String, required: true, default: new Date() },
  updateAt: { type: String, required: true, default: new Date() },
  image: { type: String, default: '' },
})

export interface ISharedWhitUsers {
  id: string
  permission: 'view' | 'edit' | 'comment'
  email: string
  username: string
}

export interface IProjectMongo {
  id?: string
  name: string
  createdPerUser: string
  tags: ITagMongo[]
  users: ISharedWhitUsers[]
  private: boolean
  password?: string
  type: string
  createAt?: string
  updateAt?: string
  image?: string
  plot: IPlotProjectMongo
}

export const ProjectMongo = mongoose.model('Project', ProjectSchema)
