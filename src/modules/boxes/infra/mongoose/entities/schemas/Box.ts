import mongoose from 'mongoose'

import { type IArchive } from '../types/IArchive'

const BoxSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  projectId: { type: String, default: '' },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  internal: { type: Boolean, required: true },
  type: { type: String, default: '' },
  tags: { type: Array<{ name: string }>, default: [] },
  archives: { type: Array<IArchive>, default: [] },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
})

export const BoxMongo = mongoose.model('Box', BoxSchema)
