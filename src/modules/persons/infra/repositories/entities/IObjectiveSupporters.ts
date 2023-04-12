import { type ObjectiveSupporters } from '@prisma/client'

import { type IPerson } from './IPerson'

export interface IObjectiveSupporters extends ObjectiveSupporters {
  persons?: Array<{ id: string }>
}
