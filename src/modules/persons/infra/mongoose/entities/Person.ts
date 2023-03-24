import mongoose from 'mongoose'

import { type IAvatar } from '@modules/accounts/infra/mongoose/entities/Avatar'
import { type IComment } from '@modules/projects/infra/mongoose/entities/Comment'

import { type IAppearance } from './Appearance'
import { type ICouple } from './Couple'
import { type IDream } from './Dream'
import { type IFear } from './Fear'
import { type IObjective } from './Objective'
import { type IPersonality } from './Personality'
import { type IPower } from './Power'
import { type ITrauma } from './Trauma'
import { type IValue } from './Value'
import { type IWishe } from './Wishe'

const PersonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fromUser: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: String, required: true },
  history: { type: String, default: '' },
  defaultProject: { type: String, required: true },
  objectives: { type: Array<IObjective>, required: true, default: [] },
  personality: { type: Array<IPersonality>, required: true, default: [] },
  appearance: { type: Array<IAppearance>, required: true, default: [] },
  dreams: { type: Array<IDream>, required: true, default: [] },
  fears: { type: Array<IFear>, required: true, default: [] },
  powers: { type: Array<IPower>, required: true, default: [] },
  couples: { type: Array<ICouple>, required: true, default: [] },
  values: { type: Array<IValue>, required: true, default: [] },
  wishes: { type: Array<IWishe>, required: true, default: [] },
  traumas: { type: Array<ITrauma>, required: true, default: [] },
  image: { type: Object, default: {} },
  createAt: { type: String, required: true },
  updateAt: { type: String, required: true },
  comments: { type: Array<IComment>, required: true, default: [] },
})

export interface IPersonMongo {
  id: string
  fromUser: string
  name: string
  lastName: string
  age: string
  history: string
  defaultProject: string
  objectives: IObjective[]
  personality: IPersonality[]
  appearance: IAppearance[]
  dreams: IDream[]
  fears: IFear[]
  powers: IPower[]
  couples: ICouple[]
  values: IValue[]
  wishes: IWishe[]
  traumas: ITrauma[]
  image?: IAvatar
  createAt: string
  updateAt: string
  comments: IComment[]
}

export const PersonMongo = mongoose.model('Person', PersonSchema)
