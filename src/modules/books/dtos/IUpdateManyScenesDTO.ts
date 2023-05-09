import { type Prisma } from '@prisma/client'

export type IUpdateManyScenesDTO = Array<{
  sceneId: string
  data: Prisma.SceneUpdateInput
} | null>
