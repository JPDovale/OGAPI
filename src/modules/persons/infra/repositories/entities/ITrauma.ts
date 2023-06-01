import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Trauma } from '@prisma/client'

import { type IConsequence } from './IConsequence'

export interface ITrauma extends Trauma {
  consequences?: IConsequence[]
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  comments?: IComment[]
}
