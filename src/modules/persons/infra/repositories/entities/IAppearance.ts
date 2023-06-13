import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Appearance } from '@prisma/client'

export interface IAppearance extends Appearance {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  comments?: IComment[]
}
