import { type Power } from '@prisma/client'

export interface IPower extends Power {
  persons?: Array<{ id: string }>
}
