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
  content: string
  to: string
}

interface IResponse {
  comment: IComment
}

@injectable()
export class CommentInPlotProjectUseCase {
  constructor(
    @inject(InjectableDependencies.Providers.NotifyUsersProvider)
    private readonly notifyUsersProvider: INotifyUsersProvider,

    @inject(InjectableDependencies.Services.VerifyPermissions)
    private readonly verifyPermissions: IVerifyPermissionsService,

    @inject(InjectableDependencies.Repositories.CommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute({
    content,
    projectId,
    to,
    userId,
  }: IRequest): Promise<IResponse> {
    const { project, user } = await this.verifyPermissions.verify({
      userId,
      projectId,
      verifyPermissionTo: 'comment',
    })

    const newComment = await this.commentsRepository.create(
      {
        user_id: userId,
        content,
        to_unknown: to,
        project_id: projectId,
      },
      {
        key: 'project',
      },
    )

    if (!newComment) throw makeErrorCommentNotCreated()

    const commentSentInto = newComment.to_unknown
    const commentContent = newComment.content

    await this.notifyUsersProvider.notifyUsersInOneProject({
      project,
      creatorId: user.id,
      title: `${user.username} comentou`,
      content: `${user.username} comentou no projeto ${project.name} em |${commentSentInto}: ${commentContent}`,
    })

    return { comment: newComment }
  }
}
