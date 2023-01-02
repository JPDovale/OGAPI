import mongoose from 'mongoose'

import { IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { IAppearance } from './Appearance'
import { ICouple } from './Couple'
import { IDream } from './Dream'
import { IFear } from './Fear'
import { IObjective } from './Objective'
import { IPersonality } from './Personality'
import { IPower } from './Power'
import { ITrauma } from './Trauma'
import { IValue } from './Value'
import { IWishe } from './Wishe'

const PersonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, replace: false },
  fromUser: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: String, required: true },
  history: { type: String, default: '' },
  defaultProject: { type: String, required: true },
  objectives: { type: Array<IObjective>, default: [] },
  personality: { type: Array<IPersonality>, default: [] },
  appearance: { type: Array<IAppearance>, default: [] },
  dreams: { type: Array<IDream>, default: [] },
  fears: { type: Array<IFear>, default: [] },
  powers: { type: Array<IPower>, default: [] },
  couples: { type: Array<ICouple>, default: [] },
  values: { type: Array<IValue>, default: [] },
  wishes: { type: Array<IWishe>, default: [] },
  traumas: { type: Array<ITrauma>, default: [] },
  image: { type: String, default: '' },
  createAt: { type: String, default: new Date() },
  updateAt: { type: String, default: new Date() },
  comments: { type: Array, default: [] },
})

export interface IPersonMongo {
  id?: string
  fromUser: string
  name: string
  lastName: string
  age: string
  history: string
  defaultProject: string
  objectives?: IObjective[]
  personality?: IPersonality[]
  appearance?: IAppearance[]
  powers?: IPower[]
  dreams?: IDream[]
  fears?: IFear[]
  wishes?: IWishe[]
  traumas?: ITrauma[]
  couples?: ICouple[]
  values?: IValue[]
  image?: string
  createAt?: string
  updateAt?: string
  comments?: IComment[]
}

export const PersonMongo = mongoose.model('Person', PersonSchema)
