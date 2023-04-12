import { type Prisma } from '@prisma/client'

export interface IUpdateFearDTO {
  fearId: string
  data: Prisma.FearUpdateInput
}
