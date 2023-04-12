import { type Prisma } from '@prisma/client'

export interface IUpdatePowerDTO {
  powerId: string
  data: Prisma.PowerUpdateInput
}
