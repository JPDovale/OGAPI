import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Objective } from '@prisma/client'

import { type IObjectiveAvoiders } from './IObjectiveAvoiders'
import { type IObjectiveSupporters } from './IObjectiveSupporters'

export interface IObjective extends Objective {
  avoiders?: IObjectiveAvoiders | null
  supporters?: IObjectiveSupporters | null
  comments?: IComment[]
  persons?: Array<{ id: string; name: string; image_url: string | null }>
}
