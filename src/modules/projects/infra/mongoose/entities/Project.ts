import mongoose from 'mongoose'

import { IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { DayJsDateProvider } from '@shared/container/provides/DateProvider/implementations/DayJsDateProvider'

import { IPlotProject } from './Plot'
import { ITag } from './Tag'

const dateProvider = new DayJsDateProvider()

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdPerUser: { type: String, required: true, unique: false },
  tags: { type: Array<ITag>, default: [] },
  users: { type: Array<ISharedWhitUsers>, default: [] },
  private: { type: Boolean, required: true },
  password: { type: String, default: '' },
  type: { type: String, required: true },
  plot: { type: Object, default: {} },
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
  image: { type: Object, default: {} },
})

export interface ISharedWhitUsers {
  id: string
  permission: 'view' | 'edit' | 'comment'
  email: string
}

export interface IProjectMongo {
  id?: string
  name: string
  createdPerUser: string
  tags: ITag[]
  users: ISharedWhitUsers[]
  private: boolean
  password?: string
  type: string
  createAt?: string
  updateAt?: string
  image?: IAvatar
  plot: IPlotProject
}

export const ProjectMongo = mongoose.model('Project', ProjectSchema)
