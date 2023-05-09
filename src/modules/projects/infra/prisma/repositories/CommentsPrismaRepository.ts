import { inject, injectable } from 'tsyringe'

import { type ICreateResponseCommentDTO } from '@modules/projects/dtos/ICreateResponseCommentDTO'
import { type Prisma } from '@prisma/client'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/ICacheProvider'
import { type IKeysRedis } from '@shared/container/providers/CacheProvider/types/Keys'
import InjectableDependencies from '@shared/container/types'
import { prisma } from '@shared/infra/database/createConnection'

import {
  type IConfig,
  type ICommentsRepository,
} from '../../repositories/contracts/ICommentsRepository'
import { type IComment } from '../../repositories/entities/IComment'
import { type ICreateResponseCommentResponse } from '../../repositories/types/ICreateResponseCommentResponse'

@injectable()
export class CommentsPrismaRepository implements ICommentsRepository {
  constructor(
    @inject(InjectableDependencies.Providers.CacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async create(
    data: Prisma.CommentUncheckedCreateInput,
    config: IConfig,
  ): Promise<IComment | null> {
    const comment = await prisma.comment.create({
      data,
    })

    if (comment) {
      this.cacheProvider
        .delete({
          key: config.key as IKeysRedis,
          objectId: data[`${config.key}_id`] ?? '',
        })
        .catch((err) => {
          throw err
        })
    }

    if (comment && config.deleteCache) {
      this.cacheProvider
        .delete({
          key: 'person',
          objectId: config.deleteCache.personId,
        })
        .catch((err) => {
          throw err
        })
    }

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
    config: IConfig,
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

    if (comment) {
      this.cacheProvider
        .deleteMany([`project-${comment.project_id}`])
        .catch((err) => {
          throw err
        })
    }

    if (response && config.deleteCache) {
      this.cacheProvider
        .deleteMany([`person-${config.deleteCache.personId}`])
        .catch((err) => {
          throw err
        })
    }

    return { comment, response }
  }
}
