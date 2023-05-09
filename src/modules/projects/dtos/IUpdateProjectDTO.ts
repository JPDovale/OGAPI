import { type Prisma } from '@prisma/client'

export interface IUpdateProjectDTO {
  projectId: string
  data: Prisma.ProjectUpdateInput
}
