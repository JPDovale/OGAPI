import { type Personality } from '@prisma/client'

import { type IConsequence } from './IConsequence'

export interface IPersonality extends Personality {
  consequences?: IConsequence[]
  persons?: Array<{ id: string }>
}
