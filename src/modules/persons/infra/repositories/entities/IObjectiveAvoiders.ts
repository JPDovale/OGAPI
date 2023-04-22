import { type ObjectiveAvoiders } from '@prisma/client'

export interface IObjectiveAvoiders extends ObjectiveAvoiders {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
}
