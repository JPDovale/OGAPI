import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Dream } from '@prisma/client'

export interface IDream extends Dream {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  comments?: IComment[]
}
