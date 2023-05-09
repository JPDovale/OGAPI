import { type Prisma } from '@prisma/client'

export interface IUpdateBoxDTO {
  boxId: string
  data: Prisma.BoxUpdateInput
}
