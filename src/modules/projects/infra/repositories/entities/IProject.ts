import { type IBookPreview } from '@modules/books/responses/IBookPreview'
import { type IPersonPreview } from '@modules/persons/responses/IPersonPreview'
import { type Project } from '@prisma/client'

import { type IComment } from './IComment'
import { type IProjectUsers } from './IUsersWithAccess'

export interface IProject extends Project {
  users_with_access_view?: IProjectUsers | null
  users_with_access_edit?: IProjectUsers | null
  users_with_access_comment?: IProjectUsers | null
  comments?: IComment[]
  books?: IBookPreview[]
  persons?: IPersonPreview[]
  user?: {
    id: string
    avatar_url: string | null
    email: string
    username: string
    name: string
  }
  _count?: {
    persons?: number
    books?: number
  }
}
