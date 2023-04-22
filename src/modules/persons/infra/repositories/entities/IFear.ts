import { type Fear } from '@prisma/client'

export interface IFear extends Fear {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
}
