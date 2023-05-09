import { type Prisma } from '@prisma/client'

export interface IUpdateCoupleDTO {
  coupleId: string
  data: Prisma.CoupleUpdateInput
}
