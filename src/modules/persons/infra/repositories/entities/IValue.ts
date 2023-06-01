import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Value } from '@prisma/client'

import { type IException } from './IException'

export interface IValue extends Value {
  exceptions?: IException[]
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  comments?: IComment[]
}
