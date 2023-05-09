import { type Prisma } from '@prisma/client'

export interface IUpdateDreamDTO {
  dreamId: string
  data: Prisma.DreamUpdateInput
}
