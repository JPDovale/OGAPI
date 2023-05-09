import { type Prisma } from '@prisma/client'

export interface IUpdatePersonDTO {
  personId: string
  data: Prisma.PersonUpdateInput
}
