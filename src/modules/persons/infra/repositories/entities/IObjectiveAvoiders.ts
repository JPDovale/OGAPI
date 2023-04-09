import { type ObjectiveAvoiders } from '@prisma/client'

import { type IPerson } from './IPerson'

export interface IObjectiveAvoiders extends ObjectiveAvoiders {
  persons?: IPerson[]
}
