import { type Dream } from '@prisma/client'

export interface IDream extends Dream {
  persons?: Array<{ id: string; name: string; image_url: string | null }>
}
