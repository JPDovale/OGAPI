import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Power } from '@prisma/client'

export interface IPower extends Power {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  comments?: IComment[]
}
