import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type IResponseComment } from '@modules/projects/infra/repositories/entities/IResponseComment'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorCommentNotCreated } from '@shared/errors/projects/makeErrorCommentNotCreated'
import { type IResolve } from '@shared/infra/http/parsers/responses/types/IResponse'

interface IRequest {
  userId: string
  personId: string
  commentId: string
  content: string
}

interface IResponse {
  response: IResponseComment
}

@injectable()
export class ResponseCommentPersonUseCase {
  constructor(
    @inject(InjectableDependencies.Repositories.PersonsRepository)
    private readonly personsRepository: IPersonsRepository,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute({
    commentId,
    content,
    personId,
    userId,
  }: IRequest): Promise<IResolve<IResponse>> {
    const person = await this.personsRepository.findById(personId)
    if (!person) {
      return {
        ok: false,
        error: makeErrorPersonNotFound(),
      }
    }

    const verification = await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'comment',
      verifyFeatureInProject: ['persons'],
    })

    if (verification.error) {
      return {
        ok: false,
        error: verification.error,
      }
    }

    const { response } = await this.commentsRepository.createResponse(
      {
        comment_id: commentId,
        content,
        user_id: userId,
      },
      {
        deleteCache: {
          personId,
        },
      },
    )

    if (!response) {
      return {
        ok: false,
        error: makeErrorCommentNotCreated(),
      }
    }

    return {
      ok: true,
      data: {
        response,
      },
    }
  }
}
