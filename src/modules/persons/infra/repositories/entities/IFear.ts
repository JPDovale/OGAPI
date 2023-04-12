import { type Fear } from '@prisma/client'

export interface IFear extends Fear {
  persons?: Array<{ id: string }>
}
