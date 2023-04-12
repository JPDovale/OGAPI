import { type Prisma } from '@prisma/client'

export interface IUpdateTraumaDTO {
  traumaId: string
  data: Prisma.TraumaUpdateInput
}
