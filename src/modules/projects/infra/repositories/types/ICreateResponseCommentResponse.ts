import { type IComment } from '../entities/IComment'
import { type IResponseComment } from '../entities/IResponseComment'

export interface ICreateResponseCommentResponse {
  comment: IComment | null
  response: IResponseComment | null
}
