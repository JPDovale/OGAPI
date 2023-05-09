import { type ICreateCommentDTO } from '@modules/projects/dtos/ICreateCommentDTO'
import { type ICreateResponseCommentDTO } from '@modules/projects/dtos/ICreateResponseCommentDTO'

import { type IComment } from '../entities/IComment'
import { type ICreateResponseCommentResponse } from '../types/ICreateResponseCommentResponse'

export interface IConfig {
  key?:
    | 'project'
    | 'objective'
    | 'personality'
    | 'appearance'
    | 'dream'
    | 'fear'
    | 'power'
    | 'couple'
    | 'value'
    | 'wishe'
    | 'trauma'
    | 'book'
    | 'capitule'
    | 'scene'

  deleteCache?: {
    personId: string
  }
}

export abstract class ICommentsRepository {
  abstract create(
    data: ICreateCommentDTO,
    config: IConfig,
  ): Promise<IComment | null>
  abstract findManyByProjectId(projectId: string): Promise<IComment[]>
  abstract createResponse(
    data: ICreateResponseCommentDTO,
    config?: IConfig,
  ): Promise<ICreateResponseCommentResponse>
}
