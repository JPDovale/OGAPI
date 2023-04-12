import { type Prisma } from '@prisma/client'

export interface IUpdateSceneDTO {
  sceneId: string
  data: Prisma.SceneUpdateInput
}
