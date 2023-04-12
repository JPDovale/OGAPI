import { type ObjectiveAvoiders } from '@prisma/client'

export interface IObjectiveAvoiders extends ObjectiveAvoiders {
  persons?: Array<{ id: string }>
}
