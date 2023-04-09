import { type Objective } from '@prisma/client'

import { type IObjectiveAvoiders } from './IObjectiveAvoiders'
import { type IObjectiveSupporters } from './IObjectiveSupporters'

export interface IObjective extends Objective {
  avoiders?: IObjectiveAvoiders
  supporters?: IObjectiveSupporters
}
