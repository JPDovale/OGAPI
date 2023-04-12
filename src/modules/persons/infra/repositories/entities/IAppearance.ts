import { type Appearance } from '@prisma/client'

export interface IAppearance extends Appearance {
  persons?: Array<{ id: string }>
}
