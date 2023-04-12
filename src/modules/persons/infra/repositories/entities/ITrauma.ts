import { type Trauma } from '@prisma/client'

import { type IConsequence } from './IConsequence'

export interface ITrauma extends Trauma {
  consequences?: IConsequence[]
  persons?: Array<{ id: string }>
}
