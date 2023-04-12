import { inject, injectable } from 'tsyringe'

import { IPersonsRepository } from '@modules/persons/infra/repositories/contracts/IPersonsRepository'
import { ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type IResponseComment } from '@modules/projects/infra/repositories/entities/IResponseComment'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorPersonNotFound } from '@shared/errors/persons/makeErrorPersonNotFound'
import { makeErrorCommentNotCreated } from '@shared/errors/projects/makeErrorCommentNotCreated'

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
  }: IRequest): Promise<IResponse> {
    const person = await this.personsRepository.findById(personId)
    if (!person) throw makeErrorPersonNotFound()

    await this.verifyPermissions.verify({
      userId,
      projectId: person.project_id,
      verifyPermissionTo: 'comment',
    })

    const { response } = await this.commentsRepository.createResponse({
      comment_id: commentId,
      content,
      user_id: userId,
    })

    if (!response) throw makeErrorCommentNotCreated()

    return {
      response,
    }
  }
}
