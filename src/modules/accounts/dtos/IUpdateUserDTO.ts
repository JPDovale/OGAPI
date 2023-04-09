import { type Prisma } from '@prisma/client'

export interface IUpdateUserDTO {
  userId: string
  data: Prisma.UserUpdateInput
}
