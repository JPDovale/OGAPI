import { type ObjectiveSupporters } from '@prisma/client'

export interface IObjectiveSupporters extends ObjectiveSupporters {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  _count?: {
    persons: number
  }
}
