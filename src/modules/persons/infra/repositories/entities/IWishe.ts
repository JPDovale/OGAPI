import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { type Wishe } from '@prisma/client'

export interface IWishe extends Wishe {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
  comments?: IComment[]
}
