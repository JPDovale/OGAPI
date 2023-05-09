import { type Prisma } from '@prisma/client'

export interface IUpdateCapituleDTO {
  capituleId: string
  data: Prisma.CapituleUpdateInput
}
