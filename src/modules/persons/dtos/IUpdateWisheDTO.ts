import { type Prisma } from '@prisma/client'

export interface IUpdateWisheDTO {
  wisheId: string
  data: Prisma.WisheUpdateInput
}
