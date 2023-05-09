import { type Prisma } from '@prisma/client'

export interface IUpdatePersonalityDTO {
  personalityId: string
  data: Prisma.PersonalityUpdateInput
}
