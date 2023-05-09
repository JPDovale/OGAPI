import { type Wishe } from '@prisma/client'

export interface IWishe extends Wishe {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
}
