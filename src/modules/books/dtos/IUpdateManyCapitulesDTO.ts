import { type Prisma } from '@prisma/client'

export type IUpdateManyCapitulesDTO = Array<{
  capituleId: string
  data: Prisma.CapituleUpdateInput
} | null>
