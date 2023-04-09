import { type ICreateCommentDTO } from '@modules/projects/dtos/ICreateCommentDTO'
import { type ICreateResponseCommentDTO } from '@modules/projects/dtos/ICreateResponseCommentDTO'

import { type IComment } from '../entities/IComment'
import { type ICreateResponseCommentResponse } from '../types/ICreateResponseCommentResponse'

export abstract class ICommentsRepository {
  abstract create(data: ICreateCommentDTO): Promise<IComment | null>
  abstract findManyByProjectId(projectId: string): Promise<IComment[]>
  abstract createResponse(
    data: ICreateResponseCommentDTO,
  ): Promise<ICreateResponseCommentResponse>
}
