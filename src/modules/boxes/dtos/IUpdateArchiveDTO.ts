import { type Prisma } from '@prisma/client'

export interface IUpdateArchiveDTO {
  archiveId: string
  data: Prisma.ArchiveUpdateInput
}
