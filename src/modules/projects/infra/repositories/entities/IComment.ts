import { type Comment } from '@prisma/client'

import { type IResponseComment } from './IResponseComment'

export interface IComment extends Comment {
  responses?: IResponseComment[]
}
