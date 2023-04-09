import { type ICreateResponseCommentDTO } from '@modules/projects/dtos/ICreateResponseCommentDTO'
import { type Prisma } from '@prisma/client'
import { prisma } from '@shared/infra/database/createConnection'

import { type ICommentsRepository } from '../../repositories/contracts/ICommentsRepository'
import { type IComment } from '../../repositories/entities/IComment'
import { type ICreateResponseCommentResponse } from '../../repositories/types/ICreateResponseCommentResponse'

export class CommentsPrismaRepository implements ICommentsRepository {
  async create(
    data: Prisma.CommentUncheckedCreateInput,
  ): Promise<IComment | null> {
    const comment = await prisma.comment.create({
      data,
    })

    return comment
  }

  async findManyByProjectId(projectId: string): Promise<IComment[]> {
    const commentsOnProject = await prisma.comment.findMany({
      where: {
        project_id: projectId,
      },
      include: {
        responses: true,
      },
    })

    return commentsOnProject
  }

  async createResponse(
    data: ICreateResponseCommentDTO,
  ): Promise<ICreateResponseCommentResponse> {
    const response = await prisma.responseComment.create({
      data,
    })

    const comment = await prisma.comment.findUnique({
      where: {
        id: data.comment_id,
      },
      include: {
        responses: true,
      },
    })

    return { comment, response }
  }
}
