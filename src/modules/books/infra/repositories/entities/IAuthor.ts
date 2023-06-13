import { type Author } from '@prisma/client'

export interface IAuthor extends Author {
  user?: {
    id: string
    avatar_url: string
    username: string
    email: string
  } | null
}
