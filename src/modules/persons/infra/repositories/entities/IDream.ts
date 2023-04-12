import { type Dream } from '@prisma/client'

export interface IDream extends Dream {
  persons?: Array<{ id: string }>
}
