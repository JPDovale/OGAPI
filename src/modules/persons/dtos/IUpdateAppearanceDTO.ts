import { type Prisma } from '@prisma/client'

export interface IUpdateAppearanceDTO {
  appearanceId: string
  data: Prisma.AppearanceUpdateInput
}
