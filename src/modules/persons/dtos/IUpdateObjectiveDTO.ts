import { type Prisma } from '@prisma/client'

export interface IUpdateObjectiveDTO {
  objectiveId: string
  data: Prisma.ObjectiveUpdateInput
}
