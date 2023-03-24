import mongoose from 'mongoose'
import { container } from 'tsyringe'

import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider'

import { type IPlotProject } from './Plot'

const dateProvider = container.resolve(DayJsDateProvider)

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdPerUser: { type: String, required: true, unique: false },
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
  id: string
  name: string
  createdPerUser: string
  users: ISharedWhitUsers[]
  private: boolean
  password?: string
  type: string
  createAt: string
  updateAt: string
  image: IAvatar
  plot: IPlotProject
}

export const ProjectMongo = mongoose.model('Project', ProjectSchema)
