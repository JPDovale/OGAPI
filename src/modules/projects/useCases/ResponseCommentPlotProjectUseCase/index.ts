import { inject, injectable } from 'tsyringe'

import { ICommentsRepository } from '@modules/projects/infra/repositories/contracts/ICommentsRepository'
import { type IComment } from '@modules/projects/infra/repositories/entities/IComment'
import { INotifyUsersProvider } from '@shared/container/providers/NotifyUsersProvider/INotifyUsersProvider'
import { IVerifyPermissionsService } from '@shared/container/services/verifyPermissions/IVerifyPermissions'
import InjectableDependencies from '@shared/container/types'
import { makeErrorCommentNotCreated } from '@shared/errors/projects/makeErrorCommentNotCreated'

interface IRequest {
  userId: string
  projectId: string
  commentId: string
  response: string
}

interface IResponse {
  comment: IComment
}

@injectable()
export class ResponseCommentPlotProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute({
    commentId,
    projectId,
    response,
    userId,
  }: IRequest): Promise<IResponse> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'comment',
    })

    const { comment, response: newResponse } =
      await this.commentsRepository.createResponse({
        user_id: userId,
        content: response,
        comment_id: commentId,
      })

    if (!comment || !newResponse) throw makeErrorCommentNotCreated()

    if (newResponse.user_id !== comment.user_id) {
      await this.notifyUsersProvider.notifyUsersInOneProject({
        project,
        title: `${user.username} respondeu o comentário em ${comment.to_unknown}`,
        content: `${user.username} acabou de responder o comentário "${comment.content}" em ${comment.to_unknown}: ${newResponse.content}`,
      })
    } else {
      await this.notifyUsersProvider.notifyUsersInOneProject({
        project,
        title: `${user.username} respondeu o próprio comentário em ${comment.to_unknown}`,
        content: `${user.username} acabou de responder o próprio comentário "${comment.content}" em ${comment.to_unknown}: ${newResponse.content}`,
      })
    }

    return { comment }
  }
}
