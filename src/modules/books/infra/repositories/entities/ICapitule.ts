import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Capitule } from '@prisma/client'

import { type IScene } from './IScene'

export interface ICapitule extends Capitule {
  scenes?: IScene[]
  comments?: IComment[]
  book?: {
    project_id: string
  }
}
