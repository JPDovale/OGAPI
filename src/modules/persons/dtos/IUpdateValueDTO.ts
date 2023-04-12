import { type Prisma } from '@prisma/client'

export interface IUpdateValueDTO {
  valueId: string
  data: Prisma.ValueUpdateInput
}
